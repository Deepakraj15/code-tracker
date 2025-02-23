export class StringBuffer {
   
    private static instance: StringBuffer;
    private buffer: string[];

    // private constructor to make it singleton
    private constructor() {
        this.buffer = [];
    }

    // Append a string to the buffer
    append(str: string): void {
        this.buffer.push(str);
    }

    // Convert the buffer content into a single string
    toString(): string {
        return this.buffer.join('');
    }

    // Clear the buffer
    clear(): void {
        this.buffer = [];
    }

    // Get the length of the buffer (number of elements)
    length(): number {
        return this.buffer.length;
    }
    

    static getInstance(): StringBuffer {
        // Create and return the unique instance if it doesn't already exist
        if (!StringBuffer.instance) {
            StringBuffer.instance = new StringBuffer();
        }
        return StringBuffer.instance;
    }
}
