function viewOverlay(){
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.style.position = "absolute";
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    document.body.appendChild(canvas);
    ctx.moveTo(0,0)
    ctx.lineTo(200,100)
    ctx.stroke()
}