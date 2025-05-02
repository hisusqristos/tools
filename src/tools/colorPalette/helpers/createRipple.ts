const createRipple = (button: HTMLButtonElement, rippleClass: string) => {
    const ripple = document.createElement('span')
    ripple.className = rippleClass

    const size = Math.max(button.clientWidth, button.clientHeight)
    ripple.style.width = ripple.style.height = `${size}px`
    ripple.style.left = `${(button.clientWidth - size) / 2}px`
    ripple.style.top = `${(button.clientHeight - size) / 2}px`

    button.appendChild(ripple)
    ripple.addEventListener('animationend', () => ripple.remove())
}

export default createRipple