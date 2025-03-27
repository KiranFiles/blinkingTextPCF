import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class RollingText implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private container: HTMLDivElement;
    private textElement: HTMLSpanElement;
    private textValue: string = "Default Text";
    private intervalId: number | undefined;

    constructor() {}

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ) {
        this.container = container;

        // Ensure container styles are set correctly
        this.container.style.overflow = "hidden";
        this.container.style.position = "relative";
        this.container.style.width = "100%";
        this.container.style.height = "40px"; // Adjust height as needed
       //this.container.style.backgroundColor = "black"; // Optional styling

        // Create the text element
        this.textElement = document.createElement("span");
        this.textElement.style.position = "absolute";  // Required for animation
        this.textElement.style.whiteSpace = "nowrap"; 
        this.textElement.style.fontSize = "20px";
        this.textElement.style.color = "red";
        this.textElement.style.fontWeight = "bold";

        this.container.appendChild(this.textElement);

        // Initialize animation
        this.startAnimation();
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        console.log("updateView called with:", context.parameters.TextValue.raw);

        this.textValue = context.parameters.TextValue.raw || "No text provided";
        this.textElement.innerText = this.textValue;

        // Restart animation
        this.startAnimation();
    }

    private startAnimation() {
        if (!this.textElement) {
            console.error("Text element not found!");
            return;
        }

        let position = this.container.offsetWidth;
        let isBlinking = true;

        // Clear previous animation
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        // Log that animation is starting
        console.log("Starting animation...");

        this.intervalId = window.setInterval(() => {
            // Move text from right to left
            position -= 2;

            if (position < -this.textElement.offsetWidth) {
                position = this.container.offsetWidth;
            }
            this.textElement.style.left = position + "px";

            // Blink effect
            isBlinking = !isBlinking;
            this.textElement.style.visibility = isBlinking ? "visible" : "hidden";

        }, 100); // Adjust speed by changing 200ms
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}
