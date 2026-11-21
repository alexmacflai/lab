// Commands retain double precision and the original Canvas 2D call order.
const METHODS = ['save','restore','translate','rotate','scale','beginPath','moveTo','lineTo',
  'bezierCurveTo','closePath','fill','clip','clearRect','stroke'];
const PROPERTIES = ['fillStyle','strokeStyle','lineWidth'];

export function recordEdgeRecipe(draw) {
  const values = [], styles = [], context = {};
  METHODS.forEach((name,code) => { context[name] = (...args) => values.push(code,args.length,...args); });
  PROPERTIES.forEach((name,index) => Object.defineProperty(context,name,{
    set(value) {
      if (typeof value === 'string') {
        if (!styles.includes(value)) styles.push(value);
        value = styles.indexOf(value);
      }
      values.push(METHODS.length + index,1,value);
    },
  }));
  draw(context); return { values: new Float64Array(values), styles };
}

export function replayEdgeRecipe(context, { values, styles }) {
  for (let offset = 0; offset < values.length;) {
    const code = values[offset++], count = values[offset++];
    const a = values[offset], b = values[offset + 1];
    switch (code) {
      case 0: context.save(); break;
      case 1: context.restore(); break;
      case 2: context.translate(a,b); break;
      case 3: context.rotate(a); break;
      case 4: context.scale(a,b); break;
      case 5: context.beginPath(); break;
      case 6: context.moveTo(a,b); break;
      case 7: context.lineTo(a,b); break;
      case 8: context.bezierCurveTo(a,b,values[offset + 2],values[offset + 3],values[offset + 4],values[offset + 5]); break;
      case 9: context.closePath(); break;
      case 10: context.fill(); break;
      case 11: context.clip(); break;
      case 12: context.clearRect(a,b,values[offset + 2],values[offset + 3]); break;
      case 13: context.stroke(); break;
      case 14: context.fillStyle = styles[a]; break;
      case 15: context.strokeStyle = styles[a]; break;
      case 16: context.lineWidth = a; break;
    }
    offset += count;
  }
}
