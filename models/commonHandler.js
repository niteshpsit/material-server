var handler  = function(next){
    console.log("this",this);
    this.release = `${this.releaseDrop} ${this.deliveryType} ${this.label}`
    next();
}

module.exports = handler;