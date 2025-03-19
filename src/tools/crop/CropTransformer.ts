// @ts-nocheck

import { useRef, useEffect, useCallback } from 'react';

const CropTransformer = ({ canvasRef, overlayCanvasRef, image }: any) => {
    // State reference
    const state = useRef({
        crop: { x: 0, y: 0, width: 0, height: 0 },
        isDragging: false,
        startPos: { x: 0, y: 0 },
        activeHandle: null,
        handles: {}
    });

    // Initialize when image changes
    useEffect(() => {
        if (!image) return;

        // Initialize main canvas
        const mainCanvas = canvasRef.current;
        if (mainCanvas) {
            const ctx = mainCanvas.getContext('2d');
            mainCanvas.width = image.width;
            mainCanvas.height = image.height;
            ctx.drawImage(image, 0, 0);
        }

        // Initialize overlay canvas
        const overlayCanvas = overlayCanvasRef.current;
        if (overlayCanvas) {
            overlayCanvas.width = image.width;
            overlayCanvas.height = image.height;
        }

        // Set initial crop region (80% of image)
        state.current.crop = {
            x: image.width * 0.1,
            y: image.height * 0.1,
            width: image.width * 0.8,
            height: image.height * 0.8
        };

        // Draw initial overlay
        drawOverlay();
    }, [image]);

    // Draw overlay with crop markers
    const drawOverlay = useCallback(() => {
        if (!overlayCanvasRef.current) return;

        const canvas = overlayCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const { crop } = state.current;

        // Clear overlay
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw semi-transparent mask (this creates the darkened effect)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Use destination-out to create a "hole" in the overlay
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fillRect(crop.x, crop.y, crop.width, crop.height);

        // Reset composite operation
        ctx.globalCompositeOperation = 'source-over';

        // Draw crop border
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeRect(crop.x, crop.y, crop.width, crop.height);

        // Draw handles
        drawHandles(ctx, crop);
    }, [overlayCanvasRef]);

    // Draw all handles at once
    const drawHandles = (ctx, crop) => {
        const { x, y, width, height } = crop;
        const handleLocations = [
            { id: 'nw', x: x, y: y },
            { id: 'n', x: x + width / 2, y: y },
            { id: 'ne', x: x + width, y: y },
            { id: 'e', x: x + width, y: y + height / 2 },
            { id: 'se', x: x + width, y: y + height },
            { id: 's', x: x + width / 2, y: y + height },
            { id: 'sw', x: x, y: y + height },
            { id: 'w', x: x, y: y + height / 2 }
        ];

        // Cache handle positions for hit testing
        state.current.handles = {};
        handleLocations.forEach(h => {
            state.current.handles[h.id] = { x: h.x, y: h.y };
        });

        // Draw all handles
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;

        handleLocations.forEach(h => {
            ctx.beginPath();
            ctx.rect(h.x - 5, h.y - 5, 10, 10);
            ctx.fill();
            ctx.stroke();
        });
    };

    // Convert client coordinates to canvas coordinates
    const getCanvasCoords = (clientX, clientY) => {
        const canvas = overlayCanvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };
    // Find handle at position or check if inside crop region
    const getInteractionType = (x, y) => {
        const { handles, crop } = state.current;

        // Check handles first
        for (const [id, handle] of Object.entries(handles)) {
            const dx = handle.x - x;
            const dy = handle.y - y;
            if (Math.sqrt(dx * dx + dy * dy) <= 10) {
                return id;
            }
        }

        // Check if inside crop region
        if (x >= crop.x && x <= crop.x + crop.width &&
            y >= crop.y && y <= crop.y + crop.height) {
            return 'move';
        }

        return null;
    };

    // Process drag updates
    const processDrag = (handleType, dx, dy) => {
        const { crop } = state.current;
        const { x, y, width, height } = crop;
        const minSize = 20;
        const maxW = canvasRef.current ? canvasRef.current.width : Infinity;
        const maxH = canvasRef.current ? canvasRef.current.height : Infinity;

        // Helper to keep values in bounds
        const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

        let newCrop = { ...crop };

        switch (handleType) {
            case 'move':
                newCrop.x = clamp(x + dx, 0, maxW - width);
                newCrop.y = clamp(y + dy, 0, maxH - height);
                break;
            case 'nw':
                newCrop.x = clamp(x + dx, 0, x + width - minSize);
                newCrop.y = clamp(y + dy, 0, y + height - minSize);
                newCrop.width = width - (newCrop.x - x);
                newCrop.height = height - (newCrop.y - y);
                break;
            case 'n':
                newCrop.y = clamp(y + dy, 0, y + height - minSize);
                newCrop.height = height - (newCrop.y - y);
                break;
            case 'ne':
                newCrop.width = clamp(width + dx, minSize, maxW - x);
                newCrop.y = clamp(y + dy, 0, y + height - minSize);
                newCrop.height = height - (newCrop.y - y);
                break;
            case 'e':
                newCrop.width = clamp(width + dx, minSize, maxW - x);
                break;
            case 'se':
                newCrop.width = clamp(width + dx, minSize, maxW - x);
                newCrop.height = clamp(height + dy, minSize, maxH - y);
                break;
            case 's':
                newCrop.height = clamp(height + dy, minSize, maxH - y);
                break;
            case 'sw':
                newCrop.x = clamp(x + dx, 0, x + width - minSize);
                newCrop.width = width - (newCrop.x - x);
                newCrop.height = clamp(height + dy, minSize, maxH - y);
                break;
            case 'w':
                newCrop.x = clamp(x + dx, 0, x + width - minSize);
                newCrop.width = width - (newCrop.x - x);
                break;
        }

        state.current.crop = newCrop;
    };

    // Event Handlers
    const handleMouseDown = useCallback(e => {
        if (!overlayCanvasRef.current) return;

        const coords = getCanvasCoords(e.clientX, e.clientY);
        const interactionType = getInteractionType(coords.x, coords.y);

        if (interactionType) {
            state.current.isDragging = true;
            state.current.activeHandle = interactionType;
            state.current.startPos = coords;

            // Update cursor
            const cursor = interactionType === 'move' ? 'move' : `${interactionType}-resize`;
            document.body.style.cursor = cursor;
            e.preventDefault();
        }
    }, []);

    const handleMouseMove = useCallback(e => {
        if (!overlayCanvasRef.current) return;

        const coords = getCanvasCoords(e.clientX, e.clientY);

        if (!state.current.isDragging) {
            // Update cursor based on position
            const interactionType = getInteractionType(coords.x, coords.y);
            document.body.style.cursor = interactionType
                ? (interactionType === 'move' ? 'move' : `${interactionType}-resize`)
                : 'default';
            return;
        }

        // Calculate deltas
        const dx = coords.x - state.current.startPos.x;
        const dy = coords.y - state.current.startPos.y;
        state.current.startPos = coords;

        // Process drag
        processDrag(state.current.activeHandle, dx, dy);
        drawOverlay();

        e.preventDefault();
    }, [drawOverlay]);
    const handleMouseUp = useCallback(() => {
        state.current.isDragging = false;
        state.current.activeHandle = null;
        document.body.style.cursor = 'default';
    }, []);

    // Apply crop to main canvas
    const applyCrop = useCallback(() => {
        if (!canvasRef.current) return null;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { x, y, width, height } = state.current.crop;

        // Create temporary canvas
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');

        // Draw cropped portion
        tempCtx.drawImage(canvas, x, y, width, height, 0, 0, width, height);

        // Resize main canvas and draw final image
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(tempCanvas, 0, 0);

        // Reset overlay canvas
        if (overlayCanvasRef.current) {
            overlayCanvasRef.current.width = width;
            overlayCanvasRef.current.height = height;
        }

        return { width, height };
    }, [canvasRef, overlayCanvasRef]);

    // Set up event listeners
    useEffect(() => {
        if (!overlayCanvasRef.current) return;

        const canvas = overlayCanvasRef.current;
        canvas.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseDown, handleMouseMove, handleMouseUp]);

    return {
        applyCrop,
        getCropRegion: () => state.current.crop
    };
};

export default CropTransformer;
