$(function() {
  "use strict";

  var ctx = document.getElementById("whiteboard").getContext('2d');

  function draw(data) {
    switch (data.type) {
    case "stroke":
      ctx.beginPath();
      ctx.strokeStyle = data.color;
      ctx.lineWidth = data.size;
      ctx.moveTo(data.start[0], data.start[1]);
      for (var point of data.points) {
        ctx.lineTo(point[0], point[1]);
      }
      ctx.stroke();
      break;
    case "text":
      ctx.font = data.font;
      ctx.fillStyle = data.color;
      ctx.fillText(data.text, data.point[0], data.point[1]);
      break;
    }
  }

  var whiteboard = $("#whiteboard");
  var color = $("#color");
  var size = $("#size");
  var text = $("#text");

  function init() {
    $.getJSON("/strokes", function(strokes) {
      for (var stroke of strokes) {
        draw(stroke);
      }
    });
  }

  init();
  $(window).resize(init);
  size.val(ctx.lineWidth);

  var request = {
    url: "/whiteboard",
    contentType: "application/json",
    transport: "websocket",
    fallbackTransport: "long-polling"
  };
  request.onMessage = function(response) {
    draw($.parseJSON(response.responseBody));
  };
  var socket = $.atmosphere.subscribe(request);

  function point(e) {
    var offset = whiteboard.offset();
    return [e.pageX - offset.left, e.pageY - offset.top];
  }

  function type() {
    return $("input[name='type']:checked").val();
  }

  var stroke;
  whiteboard.mousemove(function(e) {
    if (stroke && type() == "stroke") {
      var p = point(e);
      ctx.lineTo(p[0], p[1]);
      ctx.stroke();
      stroke.points.push(p);
    }
  }).mousedown(function(e) {
    switch (type()) {
      case "stroke":
        var p = point(e);
        ctx.beginPath();
        ctx.strokeStyle = color.val();
        ctx.lineWidth = size.val();
        ctx.moveTo(p[0], p[1]);
        stroke = {
          type: "stroke",
          color: ctx.strokeStyle,
          size: ctx.lineWidth,
          start: p,
          points: []
        };
        break;
      case "text":
        var p = point(e);
        ctx.font = size.val() + "px sans-serif";
        ctx.fillStyle = color.val();
        ctx.fillText(text.val(), p[0], p[1]);
        socket.push($.stringifyJSON({
          type: "text",
          text: text.val(),
          color: ctx.fillStyle,
          font: ctx.font,
          point: p
        }));
    }
  }).mouseup(function(e) {
    if (type() == "stroke") {
      socket.push($.stringifyJSON(stroke));
      stroke = false;
    }
  }).mouseleave(function(e) {
    if (type() == "stroke") {
      socket.push($.stringifyJSON(stroke));
      stroke = false;
    }
  });
});
