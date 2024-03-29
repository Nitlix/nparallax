
export type Action = (object: HTMLElement, move: number) => void
export type Defaults = {
    action?: string,
    speed?: number,
    offset?: number,
    transition?: string,
    both?: boolean
}

export type BindingData = { object: HTMLElement, action: string, speed: number, offset: number, transition: string, both: boolean }
