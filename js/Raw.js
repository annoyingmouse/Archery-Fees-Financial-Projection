class Raw {
    constructor() {
        this.purse = parseInt(document.getElementById("purse").value);
        this.subscribers = parseInt(document.getElementById("subscribers").value);
        this.subscription = parseInt(document.getElementById("subscription").value);
        this.indoor = parseInt(document.getElementById("indoor").value);
        this.outdoor = parseInt(document.getElementById("outdoor").value);
        this.misc = parseInt(document.getElementById("misc").value);
        this.includes = document.getElementById("includes").checked;
        this.memberships = parseInt(document.getElementById("memberships").value);
        this.extras = parseInt(document.getElementById("extras").value);
        this.projection = parseInt(document.getElementById("projection").value);
        this.explanation = document.getElementById("explanation").value;
        this.data = [];
        this.generateData();
    }

    generateHash() {
        const returnArray = [];
        returnArray.push(`purse=${this.purse}`);
        returnArray.push(`subscribers=${this.subscribers}`);
        returnArray.push(`subscription=${this.subscription}`);
        returnArray.push(`indoor=${this.indoor}`);
        returnArray.push(`outdoor=${this.outdoor}`);
        returnArray.push(`misc=${this.misc}`);
        returnArray.push(`includes=${this.includes}`);
        returnArray.push(`memberships=${this.memberships}`);
        returnArray.push(`extras=${this.extras}`);
        returnArray.push(`projection=${this.projection}`);
        returnArray.push(`explanation=${btoa(this.explanation)}`);
        return returnArray.join("&");
    }

    generateData() {
        this.data = [];
        for (let i = 0, year = 2001, month = 3, localTotal = this.purse; i < this.projection * 12; i++) {
            if (month === 11) {
                month = 0;
                year++;
            }
            this.data.push({
                "date": new Date(year, month, 1),
                "close": localTotal
            });
            if (month === 9 && this.includes) {
                localTotal -= this.subscribers * this.memberships
            }
            localTotal += this.subscribers * this.subscription;
            localTotal += this.extras;
            localTotal -= (month >= 3 && month < 9) ? this.indoor : this.outdoor;
            localTotal -= this.misc;
            month++;
        }
    }
}