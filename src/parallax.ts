import { Action, BindingData, Defaults } from './types';


export class NParallax {
    actions: Record<string, Action> = {
        vertical: (object, move) => {
            object.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + move + ", 0, 1)";
        },
        horizontal: (object, move) => {
            object.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0," + move + ", 0, 0, 1)";
        }
    }

    //listeners list
    bingings: Array<{
        listener: EventListener,
        object: HTMLElement
    }> = []


    bindObject = function(this: NParallax, bindingData: BindingData) {
        const { object, action, speed, offset, transition } = bindingData;

        object.setAttribute("np-origin", (window.scrollY + object.getBoundingClientRect().top - offset).toString());
        object.style.transition = transition;

        const render = () => {
            this.renderBinding(object, action, speed);
        }

        window.addEventListener("scroll", render);
        this.bingings.push({
            listener: render,
            object: object
        })
        render()

        
        return render;
    }

    renderBinding = function (this: NParallax, object: HTMLElement, action: string, speed: number) {
        const scroll = window.scrollY;

        //if the object is 100px above the screen, don't render
        if (object.getBoundingClientRect().bottom < -100) return;

        const origin = object.getAttribute("np-origin") as string;

        //get distance from origin
        let distance = scroll - parseInt(origin);
        let move = distance * speed;
        
        //calculate
        //use matrix3d to prevent lag

        if (this.actions[action]) this.actions[action](object, move);
        else console.error("[NParallax] Invalid data-np-action: " + action)
    }

    constructor(setDefaults: Defaults = {}) {
        const defaults = {
            action: "vertical",
            speed: 1,
            offset: 0,
            transition: "all 0.3s",
            ...setDefaults
        }

        const parallaxElements = document.querySelectorAll("[data-np-action]") as NodeListOf<HTMLElement>;

        parallaxElements.forEach((object) => {
            this.bindObject({
                object: object,
                action: object.getAttribute("data-np-action") || defaults.action,
                speed: parseFloat(object.getAttribute("data-np-speed") || "0") || defaults.speed,
                offset: parseFloat(object.getAttribute("data-np-offset") || "0") || defaults.offset,
                transition: object.getAttribute("data-np-transition") || defaults.transition
            })
        })
    }

    

    addAction = function(this: NParallax, name: string, action: Action) {
        if (typeof action === "function") this.actions[name] = action;
        else console.error("[NParallax] At addAction(): Expected a function, got " + typeof action);
    }

    destroy = function(this: NParallax) {
        this.bingings.forEach((binding) => {
            window.removeEventListener("scroll", binding.listener);
            binding.object.style.transform = "";
        });
        this.bingings = [];
    }
}