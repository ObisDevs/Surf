export class AIMouse {
  private dot: HTMLDivElement | null = null

  constructor() {
    this.createDot()
  }

  private createDot(): void {
    this.dot = document.createElement('div')
    this.dot.id = 'surfai-mouse'
    this.dot.style.cssText = `
      position: fixed;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #3b82f6;
      border: 2px solid white;
      box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
      pointer-events: none;
      z-index: 999999;
      transition: all 0.3s ease;
      display: none;
    `
    document.body.appendChild(this.dot)
  }

  show(): void {
    if (this.dot) {
      this.dot.style.display = 'block'
    }
  }

  hide(): void {
    if (this.dot) {
      this.dot.style.display = 'none'
    }
  }

  moveTo(x: number, y: number): void {
    if (this.dot) {
      this.dot.style.left = `${x}px`
      this.dot.style.top = `${y}px`
    }
  }

  pulse(): void {
    if (this.dot) {
      this.dot.style.transform = 'scale(1.5)'
      setTimeout(() => {
        if (this.dot) {
          this.dot.style.transform = 'scale(1)'
        }
      }, 300)
    }
  }

  destroy(): void {
    if (this.dot) {
      this.dot.remove()
      this.dot = null
    }
  }
}
