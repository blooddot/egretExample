interface Date {
    format(this: Date, needms?: boolean): string;
}

Date.prototype.format = function (this: Date, needms: boolean = false): string {
    let month = this.getMonth() + 1;
    let formatStr = `${this.getFullYear()}-${month}-${this.getDate()} ${this.getHours()}:${this.getMinutes()}:${this.getSeconds()}`;
    if (needms) {
        formatStr += `:${this.getMilliseconds()}`;
    }
    return formatStr;
}