function PointsTrack(opts) {
    this.linePoints = opts.linePoints;
    this.l = opts.l;
    this.s = opts.s;
    this.stateManager = [];
    this.init();
}

PointsTrack.prototype.init = function() {
    var l = this.linePoints.length;
    for(var i = 0; i < l; i++){
        var s = 1
        var o = i % (this.l + this.s)
        if (o >= this.l && o <= (this.l + this.s)) {
            s = 0;
        }

        this.stateManager.push(s);
    }
    console.log(this.stateManager);
}

PointsTrack.prototype.test = function() {
    console.log(this.stateManager);
}

PointsTrack.prototype.updateState = function() {
    var l = this.stateManager.length;
    var lastCount = 1;
    var lastState = 0;
    for (let index = 0; index < l; index++) {
        lastState = this.stateManager[index];
        if(lastState !== this.stateManager[index+1]) {
            break;
        }
        lastCount ++;
    }

    this.stateManager.pop();

    if(lastState === 0) {
        if(lastCount < this.s) {            
            this.stateManager.unshift(lastState);
        } else {
            this.stateManager.unshift(1);
        }
    }else {
        if(lastCount < this.l) {
            this.stateManager.unshift(lastState);
        } else {
            this.stateManager.unshift(0);
        }
    }
    console.log (this.stateManager);
    this.filterDisPlay();
}

PointsTrack.prototype.filterDisPlay = function() {
    var lower = undefined;
    var upper = undefined;
    var r = [];
    for (let index = 0; index < this.stateManager.length; index++) {
        const element = this.stateManager[index];
        if (lower === undefined) {
            if (element === 1) {
                lower = index;
            }
            continue;
        } else {
            if (element === 0) {
                upper = index-1
            } else if(index === this.stateManager.length -1) {
                upper = index;
            } else {

            }
        }

        if(lower !== undefined && upper !== undefined) {
            r.push({'lower': lower,'upper': upper});
            lower = undefined;
            upper = undefined;
        }
    }
    return r
}

