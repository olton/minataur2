/*! 
 * MetroUI :: ChartJS - Create different charts in js
 * https://pimenov.com.ua
 *
 * Copyright 2023 Serhii Pimenov
 * Released under the MIT license
 */

(function () {
    'use strict';

    const defaultColors = {
      aliceBlue: "#f0f8ff",
      antiqueWhite: "#faebd7",
      aqua: "#00ffff",
      aquamarine: "#7fffd4",
      azure: "#f0ffff",
      beige: "#f5f5dc",
      bisque: "#ffe4c4",
      black: "#000000",
      blanchedAlmond: "#ffebcd",
      blue: "#0000ff",
      blueViolet: "#8a2be2",
      brown: "#a52a2a",
      burlyWood: "#deb887",
      cadetBlue: "#5f9ea0",
      chartreuse: "#7fff00",
      chocolate: "#d2691e",
      coral: "#ff7f50",
      cornflowerBlue: "#6495ed",
      cornsilk: "#fff8dc",
      crimson: "#dc143c",
      cyan: "#00ffff",
      darkBlue: "#00008b",
      darkCyan: "#008b8b",
      darkGoldenRod: "#b8860b",
      darkGray: "#a9a9a9",
      darkGreen: "#006400",
      darkKhaki: "#bdb76b",
      darkMagenta: "#8b008b",
      darkOliveGreen: "#556b2f",
      darkOrange: "#ff8c00",
      darkOrchid: "#9932cc",
      darkRed: "#8b0000",
      darkSalmon: "#e9967a",
      darkSeaGreen: "#8fbc8f",
      darkSlateBlue: "#483d8b",
      darkSlateGray: "#2f4f4f",
      darkTurquoise: "#00ced1",
      darkViolet: "#9400d3",
      deepPink: "#ff1493",
      deepSkyBlue: "#00bfff",
      dimGray: "#696969",
      dodgerBlue: "#1e90ff",
      fireBrick: "#b22222",
      floralWhite: "#fffaf0",
      forestGreen: "#228b22",
      fuchsia: "#ff00ff",
      gainsboro: "#DCDCDC",
      ghostWhite: "#F8F8FF",
      gold: "#ffd700",
      goldenRod: "#daa520",
      gray: "#808080",
      green: "#008000",
      greenYellow: "#adff2f",
      honeyDew: "#f0fff0",
      hotPink: "#ff69b4",
      indianRed: "#cd5c5c",
      indigo: "#4b0082",
      ivory: "#fffff0",
      khaki: "#f0e68c",
      lavender: "#e6e6fa",
      lavenderBlush: "#fff0f5",
      lawnGreen: "#7cfc00",
      lemonChiffon: "#fffacd",
      lightBlue: "#add8e6",
      lightCoral: "#f08080",
      lightCyan: "#e0ffff",
      lightGoldenRodYellow: "#fafad2",
      lightGray: "#d3d3d3",
      lightGreen: "#90ee90",
      lightPink: "#ffb6c1",
      lightSalmon: "#ffa07a",
      lightSeaGreen: "#20b2aa",
      lightSkyBlue: "#87cefa",
      lightSlateGray: "#778899",
      lightSteelBlue: "#b0c4de",
      lightYellow: "#ffffe0",
      lime: "#00ff00",
      limeGreen: "#32dc32",
      linen: "#faf0e6",
      magenta: "#ff00ff",
      maroon: "#800000",
      mediumAquaMarine: "#66cdaa",
      mediumBlue: "#0000cd",
      mediumOrchid: "#ba55d3",
      mediumPurple: "#9370db",
      mediumSeaGreen: "#3cb371",
      mediumSlateBlue: "#7b68ee",
      mediumSpringGreen: "#00fa9a",
      mediumTurquoise: "#48d1cc",
      mediumVioletRed: "#c71585",
      midnightBlue: "#191970",
      mintCream: "#f5fffa",
      mistyRose: "#ffe4e1",
      moccasin: "#ffe4b5",
      navajoWhite: "#ffdead",
      navy: "#000080",
      oldLace: "#fdd5e6",
      olive: "#808000",
      oliveDrab: "#6b8e23",
      orange: "#ffa500",
      orangeRed: "#ff4500",
      orchid: "#da70d6",
      paleGoldenRod: "#eee8aa",
      paleGreen: "#98fb98",
      paleTurquoise: "#afeeee",
      paleVioletRed: "#db7093",
      papayaWhip: "#ffefd5",
      peachPuff: "#ffdab9",
      peru: "#cd853f",
      pink: "#ffc0cb",
      plum: "#dda0dd",
      powderBlue: "#b0e0e6",
      purple: "#800080",
      rebeccaPurple: "#663399",
      red: "#ff0000",
      rosyBrown: "#bc8f8f",
      royalBlue: "#4169e1",
      saddleBrown: "#8b4513",
      salmon: "#fa8072",
      sandyBrown: "#f4a460",
      seaGreen: "#2e8b57",
      seaShell: "#fff5ee",
      sienna: "#a0522d",
      silver: "#c0c0c0",
      slyBlue: "#87ceeb",
      slateBlue: "#6a5acd",
      slateGray: "#708090",
      snow: "#fffafa",
      springGreen: "#00ff7f",
      steelBlue: "#4682b4",
      tan: "#d2b48c",
      teal: "#008080",
      thistle: "#d8bfd8",
      tomato: "#ff6347",
      turquoise: "#40e0d0",
      violet: "#ee82ee",
      wheat: "#f5deb3",
      white: "#ffffff",
      whiteSmoke: "#f5f5f5",
      yellow: "#ffff00",
      yellowGreen: "#9acd32"
    };

    const defaultBorder = {
      width: 1,
      lineType: 'solid',
      color: '#e3e3e3',
      radius: 0
    };

    const defaultFont = {
      style: 'normal',
      family: "Helvetica, sans-serif",
      size: 12,
      weight: 'normal',
      lineHeight: 1.2,
      color: '#000'
    };
    const labelFont = Object.assign({}, defaultFont, {
      weight: 'bold'
    });
    const titleFont = Object.assign({}, defaultFont, {
      weight: 'bold',
      size: 24
    });

    const defaultTitle = {
      display: true,
      align: 'center',
      // start, center, end
      rtl: false,
      color: '#000',
      text: '',
      font: titleFont,
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      }
    };

    const defaultMargin = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    };

    const defaultPadding = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    };

    const defaultLegend = {
      rtl: false,
      margin: defaultMargin,
      padding: defaultPadding,
      font: labelFont,
      border: defaultBorder,
      dash: [],
      background: '#fff',
      vertical: false,
      position: 'top-left' // top-left, top-right, bottom-left, bottom-right, top-center, bottom-center

    };

    const defaultTooltip = {
      width: "auto",
      background: "#fff",
      color: "#000",
      font: defaultFont,
      border: defaultBorder,
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      },
      shadow: {
        shiftX: 2,
        shiftY: 2,
        blur: 4,
        stretch: 0,
        color: 'rgba(0,0,0,.5)'
      }
    };

    const defaultOptions = {
      dpi: 1,
      height: 200,
      width: "100%",
      padding: {
        top: 40,
        left: 40,
        right: 40,
        bottom: 40
      },
      margin: defaultMargin,
      background: '#fff',
      color: '#000',
      font: defaultFont,
      border: defaultBorder,
      title: defaultTitle,
      legend: defaultLegend,
      tooltip: defaultTooltip,
      boundaries: false,
      colors: Object.values(defaultColors),
      animate: false,
      onDrawLabelY: null,
      onDrawLabelX: null,
      onTooltipShow: null,
      onHover: null,
      onLeave: null
    };

    /**
     * Simple object check.
     * @param item
     * @returns {boolean}
     */
    function isObject(item) {
      return item && typeof item === 'object' && !Array.isArray(item);
    }

    /**
     * Deep merge two objects.
     * @param target
     * @param ...sources
     */

    function merge(target, ...sources) {
      if (!sources.length) return target;
      const source = sources.shift();

      if (isObject(target) && isObject(source)) {
        for (const key in source) {
          if (isObject(source[key])) {
            if (!target[key]) Object.assign(target, {
              [key]: {}
            });
            merge(target[key], source[key]);
          } else {
            Object.assign(target, {
              [key]: source[key]
            });
          }
        }
      }

      return merge(target, ...sources);
    }

    const drawText = (ctx, text, [x, y], {
      align = 'left',
      baseLine = 'middle',
      color = '#000',
      stroke = '#000',
      font,
      angle = 0,
      translate = [0, 0]
    } = {}) => {
      const {
        style = 'normal',
        weight = 'normal',
        size = 12,
        lineHeight = 1,
        family = 'sans-serif'
      } = font;
      let tX = 0,
          tY = 0;

      if (typeof translate === "number") {
        tX = tY = translate;
      } else if (Array.isArray(translate)) {
        [tX, tY] = translate;
      }

      ctx.save();
      ctx.beginPath();
      ctx.textAlign = align;
      ctx.fillStyle = color;
      ctx.strokeStyle = stroke;
      ctx.font = `${style} ${weight} ${size}px/${lineHeight} ${family}`;
      ctx.translate(tX, tY);
      ctx.rotate(angle * Math.PI / 180);
      ctx.textBaseline = baseLine;
      const lines = text.toString().split('\n');
      lines.map((str, i) => {
        ctx.fillText(str, x, y + y * i * lineHeight);
      });
      ctx.closePath();
      ctx.restore();
    };

    const getTextBoxWidth = (ctx, items, {
      font = null
    }) => {
      let size = 0,
          w;
      ctx.save();

      if (font) {
        const {
          style = 'normal',
          weight = 'normal',
          size = 12,
          lineHeight = 1.2,
          family = 'sans-serif'
        } = font;
        ctx.font = `${style} ${weight} ${size}px/${lineHeight} ${family}`;
      }

      for (let i = 0; i < items.length; i++) {
        w = ctx.measureText(items[i][0]).width;
        if (w > size) size = w;
      }

      ctx.restore();
      return size;
    };

    const drawSquare = (ctx, [x, y, r], {
      color = '#000',
      fill = '#fff',
      size = 1,
      dash = []
    } = {}) => {
      ctx.beginPath();
      ctx.save();
      ctx.setLineDash(dash);
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
      ctx.fillStyle = fill;
      ctx.rect(x - r, y - r, r * 2, r * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      ctx.closePath();
    };

    const drawBox = (ctx, [x, y, w, h], {
      color = '#fff',
      borderColor = '#000',
      dash = [],
      size = 1
    } = {}) => {
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = borderColor;
      ctx.fillStyle = color;
      ctx.setLineDash(dash);
      ctx.lineWidth = size;
      ctx.clearRect(x, y, w, h);
      ctx.fillRect(x, y, w, h);
      if (size) ctx.strokeRect(x, y, w, h);
      ctx.closePath();
      ctx.restore();
    };

    const expandPadding = padding => {
      if (typeof padding === "number") {
        return {
          top: padding,
          left: padding,
          right: padding,
          bottom: padding
        };
      }

      return padding;
    };

    const expandMargin = margin => {
      if (typeof margin === "number") {
        return {
          top: margin,
          left: margin,
          right: margin,
          bottom: margin
        };
      }

      return margin;
    };

    const MixinLegend = {
      legend() {
        const o = this.options;
        return o.legend.vertical === true ? this.legendVertical() : this.legendHorizontal();
      },

      legendHorizontal() {
        const o = this.options,
              padding = expandPadding(o.padding),
              legend = o.legend;
        const ctx = this.ctx;
        const items = this.legendItems;
        if (!legend || !isObject(legend)) return;
        if (!items || !Array.isArray(items) || !items.length) return;
        const legendPadding = expandPadding(legend.padding);
        const legendMargin = expandMargin(legend.margin);
        let lh,
            x,
            y,
            magic = 5,
            box;
        let offset = 0;
        box = legend.font.size / 2;
        lh = legend.font.size * legend.font.lineHeight;
        y = padding.top + this.viewHeight + (legend.font.size + legendPadding.top + legendMargin.top);
        x = padding.left + legendPadding.left + legendMargin.left;

        for (let i = 0; i < items.length; i++) {
          let [name, _, value] = items[i];
          offset += getTextBoxWidth(ctx, [[legend.showValue ? `${name} - ${value}` : name]], {
            font: legend.font
          }) + box * 2 + magic;
        }

        offset = (this.viewWidth - offset) / 2;

        for (let i = 0; i < items.length; i++) {
          let [name, color, value] = items[i];
          const nameWidth = getTextBoxWidth(ctx, [[legend.showValue ? `${name} - ${value}` : name]], {
            font: legend.font
          });

          if (x + nameWidth > this.viewWidth) {
            x = padding.left + legendPadding.left + legendMargin.left;
            y += lh;
          }

          drawSquare(ctx, [offset + x, y, box], {
            color,
            fill: color
          });
          drawText(ctx, legend.showValue ? `${name} - ${value}` : name, [offset + x + box + magic, y + box / 2], {
            color: legend.font.color,
            stroke: legend.font.color,
            font: o.font
          });
          x += box + nameWidth + 20;
        }
      },

      legendVertical() {
        const o = this.options,
              legend = o.legend,
              font = legend.font ?? o.font;
        let lh,
            x,
            y,
            magic = 5,
            box = font.size / 2;
        const ctx = this.ctx;
        const items = this.legendItems;
        let textBoxWidth, textBoxHeight;
        const legendPadding = expandPadding(legend.padding),
              legendMargin = expandMargin(legend.margin);
        const padding = expandPadding(o.padding);
        if (!legend || !isObject(legend)) return;
        if (!items || !Array.isArray(items) || !items.length) return;
        lh = font.size * font.lineHeight;
        textBoxWidth = getTextBoxWidth(ctx, items, {
          font
        }) + legendPadding.left + legendPadding.right + box * 3 + magic;
        textBoxHeight = items.length * lh + legendPadding.top + legendPadding.bottom + magic;

        if (legend.position === 'top-left') {
          x = legendPadding.left + legendMargin.left;
          y = legendPadding.top + legendMargin.top;
        } else if (legend.position === 'top-right') {
          x = this.dpiWidth - textBoxWidth - legendMargin.right - padding.right;
          y = legendPadding.top + legendMargin.top;
        } else if (legend.position === 'bottom-left') {
          x = legendPadding.left + legendMargin.left;
          y = this.dpiHeight - textBoxHeight - legendPadding.bottom - legendMargin.bottom;
        } else {
          x = this.dpiWidth - textBoxWidth - legendMargin.right - legendPadding.right;
          y = this.dpiHeight - textBoxHeight - legendPadding.bottom - legendMargin.bottom;
        }

        drawBox(ctx, [x, y, textBoxWidth, textBoxHeight], {
          color: legend.background,
          dash: legend.dash,
          size: legend.border.width,
          borderColor: legend.border.color
        });
        x += box + magic + legendPadding.left;
        y += box + magic + legendPadding.top;

        for (let i = 0; i < items.length; i++) {
          let [name, color, value] = items[i];
          drawSquare(ctx, [x, y, box], {
            color,
            fill: color
          });
          drawText(ctx, legend.showValue ? `${name} - ${value}` : name, [x + box + magic, y + 1], {
            color: legend.font.color,
            stroke: legend.font.color,
            font: legend.font
          });
          y += lh;
        }
      }

    };

    const MixinTooltip = {
      showTooltip(data, graph) {
        const o = this.options;

        if (this.tooltip) {
          this.tooltip.remove();
          this.tooltip = null;
        }

        if (!o.tooltip) return;
        let {
          x,
          y
        } = this.proxy.mouse;
        const tooltip = document.createElement("div");
        const onShow = o.onTooltipShow;
        const font = o.tooltip.font;
        const shadow = o.tooltip.shadow;
        const border = o.tooltip.border;
        const padding = expandPadding(o.tooltip.padding);
        tooltip.style.position = 'fixed';
        tooltip.style.border = `${border.width}px ${border.lineType} ${border.color}`;
        tooltip.style.borderRadius = `${border.radius}`;
        tooltip.style.padding = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;
        tooltip.style.background = `${o.tooltip.background}`;
        tooltip.style.font = `${font.style} ${font.weight} ${font.size}px/${font.lineHeight} ${font.family}`;
        tooltip.style.boxShadow = `${shadow.shiftX}px ${shadow.shiftY}px ${shadow.blur}px ${shadow.color}`;
        tooltip.innerHTML = onShow && typeof onShow === 'function' ? onShow.apply(null, [data, graph]) : data;
        document.querySelector('body').appendChild(tooltip);
        tooltip.style.top = `${y - tooltip.clientHeight - 15}px`;
        tooltip.style.left = `${x - tooltip.clientWidth / 2 - 5}px`;
        this.tooltip = tooltip;
        setTimeout(() => {
          if (this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
          }
        }, 3000);
      }

    };

    class Chart {
      constructor(el, data = [], options = {}, type = 'unknown') {
        if (typeof el === "string") {
          this.el = document.querySelector(el);
        } else if (el instanceof HTMLElement) {
          this.el = el;
        }

        if (!this.el) {
          throw new Error("You must define an element or a selector of element for chart container!");
        }

        this.options = merge({}, defaultOptions, options);
        this.data = data;
        this.canvas = null;
        this.ctx = null;
        this.raf = null;
        this.tooltip = null;
        this.legendItems = [];
        this.chartType = type;
        this.rect = this.el.getBoundingClientRect();
        this.canvasRect = null;
        this.static = false;
        const that = this;
        this.proxy = new Proxy({}, {
          set(...args) {
            const result = Reflect.set(...args);
            that.raf = requestAnimationFrame(that.draw.bind(that));
            return result;
          }

        });

        if (this.options.border) {
          this.el.style.border = `${this.options.border.width}px ${this.options.border.lineType} ${this.options.border.color}`;
        }

        this.calcInternalValues();
        this.createCanvas();
        this.addEvents();
      }

      createCanvas() {
        this.canvas = document.createElement("canvas");
        this.el.innerHTML = "";
        this.el.style.overflow = 'hidden';
        this.el.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.setCanvasSize();
        this.canvasRect = this.canvas.getBoundingClientRect();
      }

      setCanvasSize() {
        const o = this.options;
        this.canvas.style.height = this.height + 'px';
        this.canvas.style.width = this.width + 'px';
        this.canvas.width = o.dpi * this.width;
        this.canvas.height = o.dpi * this.height;
      }

      calcInternalValues() {
        let width, height;
        const o = this.options,
              padding = expandPadding(o.padding);
        const rect = this.el.getBoundingClientRect();
        const {
          width: elWidth,
          height: elHeight
        } = rect;
        width = o.width.toString().includes('%') ? elWidth / 100 * parseInt(o.width) : +o.width;
        height = o.height.toString().includes('%') ? elHeight / 100 * parseInt(o.height) : +o.height;
        this.width = width;
        this.height = height;
        this.dpi = o.dpi;
        this.dpiHeight = this.dpi * height;
        this.dpiWidth = this.dpi * width;
        this.viewHeight = this.dpiHeight - (padding.top + padding.bottom);
        this.viewWidth = this.dpiWidth - (padding.left + padding.right);
        this.center = [this.dpiWidth / 2, this.dpiHeight / 2];
        this.radius = Math.min(this.viewHeight, this.viewWidth) / 2;
      }

      title() {
        const title = this.options.title;
        const ctx = this.ctx;
        const magic = 5;
        let x;

        if (!title || !title.text) {
          return;
        }

        const {
          text,
          align,
          color,
          font
        } = title;

        switch (align) {
          case 'center':
            x = this.dpiWidth / 2;
            break;

          case 'right':
            x = this.dpiWidth - magic;
            break;

          default:
            x = magic;
        }

        drawText(ctx, text, [x, font.size + magic], {
          align: title.align,
          color: title.color,
          stroke: title.color,
          font: title.font
        });
      }

      setBackground(bg) {
        if (bg) {
          this.options.background = bg;
        }

        this.ctx.fillStyle = this.options.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }

      draw() {
        this.clear();
        this.setBackground();
        this.title();
      }

      clear() {
        this.ctx.clearRect(0, 0, this.dpiWidth, this.dpiHeight);
      }

      setData(data, index, redraw = true) {
        if (typeof index !== "undefined") {
          this.data[index].data = data;
        } else {
          this.data = data;
        }

        if (redraw) this.resize();
      }

      setBoundaries(obj, redraw = true) {
        const grantedKeys = ["minX", "minY", "minZ", "maxX", "maxY", "maxZ", "min", "max"];

        for (let k in obj) {
          if (grantedKeys.includes(k)) {
            this[k] = obj[k];
            this.options.boundaries[k] = obj[k];
          }
        }

        if (redraw) {
          this.draw();
        }
      }

      mouseMove(e) {
        const onHover = this.options.onHover;
        const {
          clientX: x,
          clientY: y
        } = e.changedTouches ? e.touches[0] : e;
        if (typeof onHover === "function") onHover.apply(null, [x, y]);
        this.proxy.mouse = {
          x: x,
          y: y
        };
        if (e.cancelable) e.preventDefault();
      }

      mouseLeave() {
        const fn = this.options.onLeave;
        if (typeof fn === "function") fn.apply(null, []);
        this.proxy.mouse = null;
      }

      resize() {
        this.calcInternalValues();
        this.setCanvasSize();
        this.rect = this.el.getBoundingClientRect();
        this.canvasRect = this.canvas.getBoundingClientRect();
        this.draw();
      }

      addEvents() {
        const canvas = this.canvas;
        canvas.addEventListener("mousemove", this.mouseMove.bind(this));
        canvas.addEventListener("touchmove", this.mouseMove.bind(this), {
          passive: false
        });
        canvas.addEventListener("mouseleave", this.mouseLeave.bind(this));
        window.addEventListener("resize", this.resize.bind(this));
      }

      destroy() {
        const canvas = this.canvas;
        cancelAnimationFrame(this.raf);
        canvas.removeEventListener("mousemove", this.mouseMove.bind(this));
        canvas.removeEventListener("mouseleave", this.mouseLeave.bind(this));
        window.removeEventListener("resize", this.resize.bind(this));
      }

    }
    Object.assign(Chart.prototype, MixinLegend);
    Object.assign(Chart.prototype, MixinTooltip);

    const line = {
      color: '#e3e3e3',
      size: 1,
      dash: [],
      shortLineSize: 5
    };
    const label = {
      color: '#000',
      font: labelFont,
      count: 5,
      fixed: false,
      opposite: false,
      angle: 0,
      align: 'center',
      shift: {
        x: 0,
        y: 0
      },
      skip: 0,
      showLine: true,
      showLabel: true,
      showMin: true,
      step: "auto"
    };
    const axis = {
      line,
      label
    };
    const defaultAxis = {
      x: axis,
      y: { ...axis,
        label: { ...label,
          align: 'right'
        }
      }
    };

    const defaultCross = {
      size: 1,
      color: '#bbb',
      dash: [5, 3]
    };

    const defaultArrow = {
      color: '#7d7d7d',
      size: 1,
      dash: [],
      factorX: 5,
      factorY: 5,
      outside: 0
    };
    const defaultArrows = {
      x: defaultArrow,
      y: defaultArrow
    };

    const defaultAreaChartOptions = {
      axis: defaultAxis,
      cross: defaultCross,
      showDots: true,
      accuracy: 2,
      arrows: defaultArrows
    };

    const minMax = (data = [], by = 'x') => {
      let min, max, v;
      let index;

      if (typeof by === "number") {
        index = by;
      } else {
        switch (by.toString().toLowerCase()) {
          case 'y':
            index = 1;
            break;

          case 'z':
            index = 2;
            break;

          default:
            index = 0;
        }
      }

      for (const _ of data) {
        v = _[index];
        if (isNaN(min) || min > v) min = v;
        if (isNaN(max) || max < v) max = v;
      }

      return [min, max];
    };
    const minMaxLinear = (data = []) => {
      let min, max;
      min = Math.min.apply(null, data);
      max = Math.max.apply(null, data);
      return [min, max];
    };

    const drawCircle = (ctx, [x, y, r], {
      color = '#000',
      fill = '#fff',
      size = 1
    } = {}) => {
      ctx.beginPath();
      ctx.save();
      ctx.setLineDash([]);
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
      ctx.fillStyle = fill;
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      ctx.closePath();
    };

    const drawTriangle = (ctx, [x, y, r], {
      color = '#000',
      fill = '#fff',
      size = 1
    } = {}) => {
      ctx.beginPath();
      ctx.save();
      ctx.setLineDash([]);
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
      ctx.fillStyle = fill;
      ctx.moveTo(x, y - r);
      ctx.lineTo(x + r, y + r);
      ctx.lineTo(x - r, y + r);
      ctx.lineTo(x, y - r);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      ctx.closePath();
    };

    const drawDiamond = (ctx, [x, y, r], {
      color = '#000',
      fill = '#fff',
      size = 1
    } = {}) => {
      ctx.beginPath();
      ctx.save();
      ctx.setLineDash([]);
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
      ctx.fillStyle = fill;
      ctx.moveTo(x, y - r);
      ctx.lineTo(x + r, y);
      ctx.lineTo(x, y + r);
      ctx.lineTo(x - r, y);
      ctx.lineTo(x, y - r);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      ctx.closePath();
    };

    const drawArea = (ctx, coords = [], {
      color = '#000',
      fill = '#000',
      size = 1,
      dash = []
    } = {}) => {
      ctx.beginPath();
      ctx.save();
      ctx.setLineDash(dash);
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
      ctx.fillStyle = fill;
      coords.map(([x, y]) => {
        ctx.lineTo(x, y);
      });
      ctx.lineTo(coords[0][0], coords[0][1]);
      ctx.fill();
      ctx.restore();
      ctx.closePath();
    };

    const MixinCross = {
      cross() {
        const o = this.options,
              cross = o.cross;
        const padding = expandPadding(o.padding);
        const ctx = this.ctx;
        const rect = this.canvas.getBoundingClientRect();
        if (!o.cross || o.cross && !this.proxy.mouse) return;
        let {
          x,
          y
        } = this.proxy.mouse;
        x -= rect.left;
        y -= rect.top;
        if (x - padding.left + 1 < 0 || x > this.viewWidth + padding.left + 1) return;
        if (y - padding.top + 1 < 0 || y > this.viewHeight + padding.top + 1) return;
        ctx.beginPath();
        ctx.setLineDash(o.cross.dash);
        ctx.lineWidth = cross.size;
        ctx.strokeStyle = cross.color; // vertical line

        ctx.moveTo(x, padding.top);
        ctx.lineTo(x, this.viewHeight + padding.top); // Horizontal line

        ctx.moveTo(padding.left, y);
        ctx.lineTo(this.viewWidth + padding.left, y);
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
      }

    };

    const drawVector = (ctx, [x1, y1, x2, y2], {
      color = '#000',
      size = 1,
      dash = []
    } = {}) => {
      ctx.beginPath();
      ctx.save();
      ctx.setLineDash(dash);
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();
      ctx.closePath();
    };

    const ceil = (a, b) => Math.ceil(a / b) * b;

    const MixinAxis = {
      axisX() {
        const ctx = this.ctx,
              o = this.options;
        const padding = expandPadding(o.padding);
        if (!o.axis.x) return;
        const axis = o.axis.x,
              label = axis.label,
              line = axis.line,
              arrow = axis.arrow;
        const font = (label && label.font) ?? o.font;
        const lFactor = 10 ** (("" + this.maxX).length - 2);
        const lMax = ceil(this.maxX, lFactor);
        const labelStep = label.step === 'auto' ? label.count ? (this.maxX - this.minX) / label.count : 0 : label.step ? label.step : label.count ? Math.ceil(lMax / label.count) : 0;
        let labelValue,
            value,
            k,
            x,
            y,
            labelY,
            shortLineSize = line.shortLineSize ?? 0;
        x = padding.left;
        y = padding.top;
        labelY = padding.top + this.viewHeight + font.size + 5;
        value = this.minX;
        k = 0;

        for (let i = 0; i <= label.count; i++) {
          labelValue = typeof label.fixed === "number" ? value.toFixed(label.fixed) : value;

          if (typeof o.onDrawLabelX === "function") {
            labelValue = o.onDrawLabelX.apply(null, [value]);
          }

          if (label.showLine) {
            drawVector(ctx, [x, y, x, y + this.viewHeight], {
              color: line.color,
              size: line.size,
              dash: line.dash
            });
          }

          if (label.skip && k !== label.skip) {
            k++;
          } else {
            k = 1;

            if (label.showLabel && !(!i && !label.showMin)) {
              // short line
              drawVector(ctx, [x, this.viewHeight + padding.top - shortLineSize, x, this.viewHeight + padding.top + shortLineSize], {
                color: arrow && arrow.color ? arrow.color : line.color
              }); // label

              drawText(ctx, labelValue.toString(), [0, 0], {
                color: label.color ?? o.color,
                align: label.align,
                font,
                translate: [x + (label.shift.x ?? 0), labelY + (label.shift.y ?? 0)],
                angle: label.angle
              });
            }
          }

          value += labelStep;
          x = padding.left + (value - this.minX) * this.ratioX;
        }
      },

      axisY() {
        const ctx = this.ctx,
              o = this.options;
        const padding = expandPadding(o.padding);
        if (!o.axis.y) return;
        const axis = o.axis.y,
              label = axis.label,
              line = axis.line,
              arrow = axis.arrow;
        const font = (label && label.font) ?? o.font;
        const lFactor = 10 ** (("" + this.maxY).length - 2);
        const lMax = ceil(this.maxY, lFactor);
        const labelStep = label.step === 'auto' ? label.count ? (this.maxY - this.minY) / label.count : 0 : label.step ? label.step : label.count ? Math.ceil(lMax / label.count) : 0;
        let labelValue, value, k, x, y, labelX, shortLineX;
        const shortLineSize = line.shortLineSize ?? 0;
        x = padding.left;
        labelX = padding.left;
        y = this.viewHeight + padding.top;
        value = this.minY;
        k = 0;

        if (label.opposite) {
          labelX += this.viewWidth + 10 + shortLineSize;
          shortLineX = padding.left + this.viewWidth;
          label.align = 'left';
        } else {
          labelX -= 10;
          shortLineX = x - shortLineSize;
        }

        for (let i = 0; i < label.count + 1; i++) {
          labelValue = typeof label.fixed === "number" ? value.toFixed(label.fixed) : value;

          if (typeof o.onDrawLabelY === "function") {
            labelValue = o.onDrawLabelY.apply(null, [value]);
          }

          if (label.showLine) {
            drawVector(ctx, [x, y, this.viewWidth + padding.left, y], {
              color: line.color,
              size: line.size,
              dash: line.dash
            });
          }

          if (i !== 0 && label.skip && k !== label.skip) {
            k++;
          } else {
            k = 1;

            if (label.showLabel && !(!i && !label.showMin)) {
              // short line
              drawVector(ctx, [shortLineX, y, shortLineX + shortLineSize * 2, y], {
                color: arrow && arrow.color ? arrow.color : line.color
              });
              drawText(ctx, labelValue.toString(), [0, 0], {
                color: (label && label.color) ?? o.color,
                align: label.align,
                font,
                translate: [labelX + (label.shift.x ?? 0), y + 1 + (label.shift.y ?? 0)],
                angle: label.angle
              });
            }
          }

          value += labelStep;
          y = padding.top + this.viewHeight - (value - this.minY) * this.ratioY;
        }
      },

      axisXY() {
        if (!this.options.axis) return;
        this.axisX();
        this.axisY();
        return this;
      }

    };

    const MixinAddPoint = {
      addPoint(index, point, shift = false) {
        const o = this.options;
        let data;

        if (!this.data) {
          this.data = [];

          for (let i = 0; i < index + 1; i++) {
            this.data[i] = [];
          }
        }

        data = this.data[index];

        if (shift && data.length) {
          if (!o.graphSize) {
            data = data.slice(1);
          } else {
            if (data.length >= o.graphSize) {
              data = data.slice(1);
            }
          }
        }

        this.data[index] = data;
        this.data[index].push(point);
      }

    };

    const drawLine = (ctx, coords = [], {
      color = '#000',
      size = 1,
      dash = []
    } = {}) => {
      ctx.beginPath();
      ctx.save();
      ctx.setLineDash(dash);
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
      coords.map(([x, y]) => {
        ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.restore();
      ctx.closePath();
    };

    const drawArrowX = (ctx, [x1, y1, x2, y2, factorX, factorY], {
      color = '#000',
      dash = [],
      size = 1
    } = {}) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.setLineDash(dash);
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - factorX, y2 - factorY);
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - factorX, y2 + factorY);
      ctx.stroke();
      ctx.closePath();
    };

    const drawArrowY = (ctx, [x1, y1, x2, y2, factorX, factorY], {
      color = '#000',
      dash = [],
      size = 1
    } = {}) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.setLineDash(dash);
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - factorX, y2 + factorY);
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 + factorX, y2 + factorY);
      ctx.stroke();
      ctx.closePath();
    };

    const MixinArrows = {
      arrowX() {
        const o = this.options,
              ctx = this.ctx;
        const padding = expandPadding(o.padding);
        if (!o.arrows.x) return;
        const arrow = o.arrows.x;
        const x1 = padding.left,
              y1 = this.viewHeight + padding.top;
        const x2 = padding.left + this.viewWidth + arrow.outside,
              y2 = y1;
        drawArrowX(ctx, [x1, y1, x2, y2, arrow.factorX, arrow.factorY], {
          color: arrow.color,
          size: arrow.size,
          dash: arrow.dash
        });
      },

      arrowY() {
        const o = this.options,
              ctx = this.ctx;
        const padding = expandPadding(o.padding);
        if (!o.arrows.y) return;
        const arrow = o.arrows.y;
        const x = padding.left,
              y1 = this.viewHeight + padding.top;
        const y2 = padding.top - arrow.outside;
        drawArrowY(ctx, [x, y1, x, y2, arrow.factorX, arrow.factorY], {
          color: arrow.color,
          size: arrow.size,
          dash: arrow.dash
        });
      },

      arrows() {
        if (!this.options.arrows) return;
        this.arrowX();
        this.arrowY();
        return this;
      }

    };

    class AreaChart extends Chart {
      constructor(el, data = [], options = {}) {
        super(el, data, merge({}, defaultAreaChartOptions, options), 'area');
        this.coords = {};
        this.minX = 0;
        this.maxX = 0;
        this.minY = 0;
        this.maxY = 0;
        this.legendItems = [];
        const legend = this.options.legend;
        const areas = this.options.areas;
        const colors = this.options.colors;

        if (legend) {
          for (let i = 0; i < this.data.length; i++) {
            this.legendItems.push([areas[i].name, colors[i]]);
          }
        }

        this.calcMinMax();
        this.resize();
      }

      calcMinMax() {
        const o = this.options;
        let a = [];

        for (let _data of this.data) {
          if (!Array.isArray(_data)) continue;

          for (const [x, y] of _data) {
            a.push([x, y]);
          }
        }

        const [minX, maxX] = minMax(a, 'x');
        const [minY, maxY] = minMax(a, 'y');
        this.minX = o.boundaries && !isNaN(o.boundaries.minX) ? o.boundaries.minX : minX;
        this.maxX = o.boundaries && !isNaN(o.boundaries.maxX) ? o.boundaries.maxX : maxX;
        this.minY = o.boundaries && !isNaN(o.boundaries.minY) ? o.boundaries.minY : minY;
        this.maxY = o.boundaries && !isNaN(o.boundaries.maxY) ? o.boundaries.maxY : maxY;
        if (isNaN(this.minX)) this.minX = 0;
        if (isNaN(this.maxX)) this.maxX = 100;
        if (isNaN(this.minY)) this.minX = 0;
        if (isNaN(this.maxY)) this.maxX = 100;
      }

      calcRatio() {
        this.ratioX = this.viewWidth / (this.maxX === this.minX ? this.maxX : this.maxX - this.minX);
        this.ratioY = this.viewHeight / (this.maxY === this.minY ? this.maxY : this.maxY - this.minY);
      }

      areas() {
        const o = this.options,
              padding = expandPadding(o.padding);
        const ctx = this.ctx;
        let coords;
        if (!this.data || !this.data.length) return;

        for (let i = 0; i < this.data.length; i++) {
          const area = o.areas[i];
          const data = this.data[i];
          const color = area.color ?? o.colors[i];
          const fill = area.fill ?? color;
          coords = [];
          coords.push([padding.left, this.viewHeight + padding.top, 0, 0]);

          for (const [x, y] of data) {
            let _x = Math.floor((x - this.minX) * this.ratioX + padding.left);

            let _y = Math.floor(this.viewHeight + padding.top - (y - this.minY) * this.ratioY);

            coords.push([_x, _y, x, y]);
          }

          coords.push([coords[coords.length - 1][0], this.viewHeight + padding.top, 0, 0]);
          drawArea(ctx, coords, {
            color,
            fill,
            size: area.size
          });
          let dots = area.dots ? area.dots : {
            type: 'dot' // dot, square, triangle

          };
          let opt = {
            color: dots.color ?? color,
            fill: dots.fill ?? color,
            radius: dots.size ?? 4
          };
          let drawPointFn;

          switch (dots.type) {
            case 'square':
              drawPointFn = drawSquare;
              break;

            case 'triangle':
              drawPointFn = drawTriangle;
              break;

            case 'diamond':
              drawPointFn = drawDiamond;
              break;

            default:
              drawPointFn = drawCircle;
          }

          if (area.dots && o.showDots !== false) {
            coords.map(([x, y], index) => {
              if (index && index < coords.length - 1) drawPointFn(ctx, [x, y, opt.radius], opt);
            });
          }

          this.coords[area.name] = {
            area,
            coords,
            drawPointFn,
            opt
          };
          coords.shift();
          coords.pop();

          if (area.showLines !== false) {
            drawLine(ctx, coords, {
              color,
              fill,
              size: area.size
            });
          }
        }
      }

      floatPoint() {
        const o = this.options;
        const ctx = this.ctx;
        const rect = this.canvas.getBoundingClientRect();
        let tooltip = false;
        if (!this.data || !this.data.length) return;
        if (!this.proxy.mouse) return;
        let {
          x,
          y
        } = this.proxy.mouse;
        const mx = x - rect.left;
        const my = y - rect.top;

        for (const name in this.coords) {
          const item = this.coords[name];
          const drawPointFn = item.drawPointFn;
          const opt = item.opt;

          for (const [px, py, _x, _y] of item.coords) {
            const accuracy = +(o.accuracy || opt.radius);
            const lx = px - accuracy,
                  rx = px + accuracy;
            const ly = py - accuracy,
                  ry = py + accuracy;

            if (mx > lx && mx < rx && o.hoverMode !== 'default') {
              drawPointFn(ctx, [px, py, opt.radius], {
                color: opt.color,
                fill: opt.fill
              });
            }

            if (mx > lx && mx < rx && my > ly && my < ry) {
              if (o.hoverMode === 'default') drawPointFn(ctx, [px, py, opt.radius * 2], {
                color: opt.color,
                fill: opt.fill
              });

              if (o.tooltip) {
                this.showTooltip([_x, _y], item.graph);
                tooltip = true;
              }

              break;
            }
          }

          if (!tooltip && this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
          }
        }
      }

      add(index, [x, y], shift, align) {
        this.addPoint(index, [x, y], shift);
        this.minX = this.data[index][0][0];
        this.maxX = x;

        if (align) {
          if (isObject(align)) {
            this.align(align);
          }
        } else {
          if (y < this.minY) this.minY = y;
          if (y > this.maxY) this.maxY = y;
        }

        this.resize();
      }

      align({
        minX,
        maxX,
        minY,
        maxY
      }) {
        let a = [];

        for (let _data of this.data) {
          if (!Array.isArray(_data)) continue;

          for (const [x, y] of _data) {
            a.push([x, y]);
          }
        }

        const [_minX, _maxX] = minMax(a, 'x');
        const [_minY, _maxY] = minMax(a, 'y');
        if (minX) this.minX = _minX;
        if (minY) this.minY = _minY;
        if (maxX) this.maxX = _maxX;
        if (maxY) this.maxY = _maxY;
      }

      draw() {
        super.draw();
        this.calcRatio();
        this.axisXY();
        this.arrows();
        this.areas();
        this.floatPoint();
        this.cross();
        this.legend();
      }

    }
    Object.assign(AreaChart.prototype, MixinCross);
    Object.assign(AreaChart.prototype, MixinAxis);
    Object.assign(AreaChart.prototype, MixinAddPoint);
    Object.assign(AreaChart.prototype, MixinArrows);
    const areaChart = (el, data, options) => new AreaChart(el, data, options);

    const defaultBarChartOptions = {
      groupDistance: 0,
      barDistance: 0,
      axis: { ...defaultAxis
      },
      dataAxisX: false,
      labels: {
        font: labelFont,
        color: '#000'
      },
      arrows: defaultArrows,
      onDrawLabel: null
    };

    const drawRect = (ctx, [x, y, w, h], {
      color = '#000',
      fill = '#fff',
      size = 1,
      dash = []
    } = {}) => {
      ctx.beginPath();
      ctx.save();
      ctx.setLineDash(dash);
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
      ctx.fillStyle = fill;
      ctx.rect(x, y, w, h);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      ctx.closePath();
    };

    class BarChart extends Chart {
      constructor(el, data, options) {
        super(el, data, merge({}, defaultBarChartOptions, options), 'bar');
        this.groups = 0;
        this.barWidth = 0;
        this.maxY = 0;
        this.maxX = 0;
        this.minY = 0;
        this.minX = 0;
        this.viewAxis = this.options.dataAxisX ? this.viewHeight : this.viewWidth;
        this.legendItems = [];
        const legend = this.options.legend;

        if (legend && legend.titles && legend.titles.length) {
          for (let i = 0; i < legend.titles.length; i++) {
            this.legendItems.push([legend.titles[i], this.options.colors[i]]);
          }
        }

        this.calcMinMax();
        this.resize();
      }

      calcMinMax() {
        const o = this.options;
        let a = [];

        for (let k in this.data) {
          a = [].concat(a, this.data[k]);
        }

        this.groups = this.data.length;
        const [, max] = minMaxLinear(a);
        this.maxX = this.maxY = o.boundaries && !isNaN(o.boundaries.max) ? o.boundaries.max : max;
        if (isNaN(this.maxX)) this.maxX = 100;
        if (isNaN(this.maxY)) this.maxX = 100;
      }

      calcRatio() {
        this.ratioX = this.ratioY = this.ratio = (this.options.dataAxisX ? this.viewWidth : this.viewHeight) / (this.maxY === this.minY ? this.maxY : this.maxY - this.minY);
      }

      calcBarWidth() {
        const o = this.options;
        let bars = 0;

        for (let i = 0; i < this.data.length; i++) {
          bars += Array.isArray(this.data[i]) ? this.data[i].length : 1;
        }

        let availableSpace = (o.dataAxisX ? this.viewHeight : this.viewWidth) - (this.data.length + 1) * o.groupDistance // space between groups
        - (bars - this.data.length) * o.barDistance; // space between bars

        this.barWidth = availableSpace / bars;
      }

      bars(axisX = false) {
        const o = this.options,
              bars = o.bars;
        const padding = expandPadding(o.padding);
        const ctx = this.ctx;
        const rect = this.canvas.getBoundingClientRect();
        let px,
            py,
            mx,
            my,
            tooltip = false;
        if (!this.data || !this.data.length) return;

        if (this.proxy.mouse) {
          mx = this.proxy.mouse.x - rect.left;
          my = this.proxy.mouse.y - rect.top;
        }

        px = axisX ? padding.left : padding.left + o.groupDistance;
        py = axisX ? padding.top + o.groupDistance : this.viewHeight + padding.top;

        for (let g = 0; g < this.data.length; g++) {
          const graph = this.data[g];
          const data = Array.isArray(graph) ? graph : [graph];
          const labelColor = o.labels.color;
          let name = bars[g];
          let groupWidth = 0;

          for (let i = 0; i < data.length; i++) {
            let delta = data[i] * this.ratio;
            let color = data.length === 1 ? o.colors[g] : o.colors[i];
            const options = {
              color,
              fill: color
            };
            const coords = axisX ? [px, py, px + delta - padding.right, this.barWidth] : [px, py - delta, this.barWidth - 1, delta];
            drawRect(ctx, coords, options);
            const borderX = axisX ? [px, px + delta] : [px, px + this.barWidth - 1];
            const borderY = axisX ? [py, py + this.barWidth - 1] : [py - delta, py];

            if (mx > borderX[0] && mx < borderX[1] && my > borderY[0] && my < borderY[1]) {
              drawRect(ctx, coords, { ...options,
                fill: 'rgba(255,255,255,.3)'
              });

              if (o.tooltip) {
                this.showTooltip([o.legend.titles ? o.legend.titles[i] : name, data[i]], graph);
                tooltip = true;
              }
            }

            groupWidth += this.barWidth + o.barDistance;

            if (axisX) {
              py += o.barDistance + this.barWidth;
            } else {
              px += o.barDistance + this.barWidth;
            }
          }

          if (axisX) {
            py -= o.barDistance;
          } else {
            px -= o.barDistance;
          }

          groupWidth -= o.barDistance;

          if (typeof o.onDrawLabel === 'function') {
            name = o.onDrawLabel.apply(null, name);
          }

          drawText(ctx, name, [0, 0], {
            align: 'center',
            color: labelColor,
            stroke: labelColor,
            font: o.font,
            angle: axisX ? 90 : 0,
            translate: axisX ? [px - 20, py - groupWidth / 2] : [px - groupWidth / 2, py + 20]
          });

          if (axisX) {
            py += o.groupDistance;
          } else {
            px += o.groupDistance;
          }
        }

        if (!tooltip && this.tooltip) {
          this.tooltip.remove();
          this.tooltip = null;
        }

        this.static = true;
      }

      draw() {
        const o = this.options;
        super.draw();
        this.calcBarWidth();
        this.calcRatio();

        if (o.dataAxisX) {
          this.axisX();
        } else {
          this.axisY();
        }

        this.bars(o.dataAxisX);
        this.arrows();
        this.legend();
      }

    }
    Object.assign(BarChart.prototype, MixinAxis);
    Object.assign(BarChart.prototype, MixinArrows);
    const barChart = (el, data, options) => new BarChart(el, data, options);

    const defaultBubbleChartOptions = {
      axis: defaultAxis,
      cross: defaultCross,
      arrows: defaultArrows
    };

    class BubbleChart extends Chart {
      constructor(el, data, options) {
        super(el, data, merge({}, defaultBubbleChartOptions, options), 'bubble');
        this.coords = {};
        this.minX = 0;
        this.maxX = 0;
        this.minY = 0;
        this.maxY = 0;
        this.minZ = 0;
        this.maxZ = 0;
        this.legendItems = [];
        const legend = this.options.legend;

        if (legend) {
          for (let i = 0; i < this.data.length; i++) {
            this.legendItems.push([this.data[i].name, this.options.colors[i]]);
          }
        }

        this.calcMinMax();
        this.resize();
      }

      calcMinMax() {
        const o = this.options;
        let a = [];

        for (let k in this.data) {
          let _data = this.data[k].data;
          if (!Array.isArray(_data)) continue;
          a.push(_data);
        }

        const [minX, maxX] = minMax(a, 'x');
        const [minY, maxY] = minMax(a, 'y');
        const [minZ, maxZ] = minMax(a, 'z');
        this.minX = o.boundaries && !isNaN(o.boundaries.minX) ? o.boundaries.minX : minX;
        this.maxX = o.boundaries && !isNaN(o.boundaries.maxX) ? o.boundaries.maxX : maxX;
        this.minY = o.boundaries && !isNaN(o.boundaries.minY) ? o.boundaries.minY : minY;
        this.maxY = o.boundaries && !isNaN(o.boundaries.maxY) ? o.boundaries.maxY : maxY;
        this.minZ = o.boundaries && !isNaN(o.boundaries.minZ) ? o.boundaries.minZ : minZ;
        this.maxZ = o.boundaries && !isNaN(o.boundaries.maxZ) ? o.boundaries.maxZ : maxZ;
        if (isNaN(this.minX)) this.minX = 0;
        if (isNaN(this.maxX)) this.maxX = 100;
        if (isNaN(this.minY)) this.minX = 0;
        if (isNaN(this.maxY)) this.maxX = 100;
        if (isNaN(this.minZ)) this.minX = 0;
        if (isNaN(this.maxZ)) this.maxX = 100;
      }

      calcRatio() {
        this.ratioX = this.viewWidth / (this.maxX === this.minX ? this.maxX : this.maxX - this.minX);
        this.ratioY = this.viewHeight / (this.maxY === this.minY ? this.maxY : this.maxY - this.minY);
        this.ratioZ = this.maxZ / (this.maxZ === this.minZ ? this.maxZ : this.maxZ - this.minZ);
      }

      bubbles() {
        const o = this.options,
              padding = expandPadding(o.padding);
        const ctx = this.ctx;
        if (!this.data || !this.data.length) return;

        for (let i = 0; i < this.data.length; i++) {
          const graph = this.data[i];
          const color = o.colors[i];
          const [x, y, z] = graph.data;

          let _x = Math.floor((x - this.minX) * this.ratioX + padding.left);

          let _y = Math.floor(this.viewHeight + padding.top - (y - this.minY) * this.ratioY);

          let _z = Math.floor(z * this.ratioZ);

          drawCircle(ctx, [_x, _y, _z], {
            fill: color,
            color: color
          });
        }
      }

      floatPoint() {
        if (!this.data || !this.data.length) return;
      }

      add(index, [x, y, z], shift = false) {
        this.addPoint(index, [x, y, z], shift);
        if (x < this.minX) this.minX = x;
        if (x > this.maxX) this.maxX = x;
        if (y < this.minY) this.minY = y;
        if (y > this.maxY) this.maxY = y;
        if (z < this.minZ) this.minZ = z;
        if (z > this.maxZ) this.maxZ = z;
        this.resize();
      }

      draw() {
        super.draw();
        this.calcRatio();
        this.axisXY();
        this.arrows();
        this.bubbles();
        this.floatPoint();
        this.cross();
        this.legend();
      }

    }
    Object.assign(BubbleChart.prototype, MixinCross);
    Object.assign(BubbleChart.prototype, MixinAxis);
    Object.assign(BubbleChart.prototype, MixinArrows);
    const bubbleChart = (el, data, options) => new BubbleChart(el, data, options);

    const defaultHistogramOptions = {
      barWidth: 10,
      axis: { ...defaultAxis,
        x: { ...defaultAxis.x,
          arrow: false
        },
        y: { ...defaultAxis.y,
          arrow: false
        }
      },
      cross: defaultCross,
      graphSize: 40,
      bars: {
        stroke: '#fff'
      }
    };

    class HistogramChart extends Chart {
      constructor(el, data = [], options = {}) {
        super(el, data, merge({}, defaultHistogramOptions, options), 'histogram');
        this.coords = {};
        this.minX = 0;
        this.maxX = 0;
        this.minY = 0;
        this.maxY = 0;
        this.legendItems = [];
        const legend = this.options.legend;
        const bars = this.options.bars;
        const colors = this.options.colors;

        if (legend) {
          for (let i = 0; i < this.data.length; i++) {
            this.legendItems.push([bars[i].name, colors[i]]);
          }
        }

        this.calcMinMax();
        this.resize();
      }

      calcMinMax() {
        const o = this.options;
        let a = [];

        for (let _data of this.data) {
          if (!Array.isArray(_data)) continue;

          for (const [x1, x2, y] of _data) {
            a.push([x1, x2, y]);
          }
        }

        const [minX1, maxX1] = minMax(a, 0);
        const [minX2, maxX2] = minMax(a, 1);
        const [minY, maxY] = minMax(a, 2);
        this.minX = o.boundaries && !isNaN(o.boundaries.minX) ? o.boundaries.minX : Math.min(minX1, minX2);
        this.maxX = o.boundaries && !isNaN(o.boundaries.maxX) ? o.boundaries.maxX : Math.max(maxX1, maxX2);
        this.minY = o.boundaries && !isNaN(o.boundaries.minY) ? o.boundaries.minY : minY;
        this.maxY = o.boundaries && !isNaN(o.boundaries.maxY) ? o.boundaries.maxY : maxY;
        if (isNaN(this.minX)) this.minX = 0;
        if (isNaN(this.maxX)) this.maxX = 100;
        if (isNaN(this.minY)) this.minX = 0;
        if (isNaN(this.maxY)) this.maxX = 100;
      }

      calcRatio() {
        this.ratioX = this.viewWidth / (this.maxX === this.minX ? this.maxX : this.maxX - this.minX);
        this.ratioY = this.viewHeight / (this.maxY === this.minY ? this.maxY : this.maxY - this.minY);
      }

      bars() {
        const o = this.options,
              padding = expandPadding(o.padding);
        const ctx = this.ctx;
        if (!this.data || !this.data.length) return;

        for (let i = 0; i < this.data.length; i++) {
          const bar = o.bars[i];
          const data = this.data[i];
          const color = bar.color || o.colors[i] || "#000";
          const stroke = bar.stroke || '#fff';

          for (const [x1, x2, y] of data) {
            let _x = Math.floor((x1 - this.minX) * this.ratioX + padding.left);

            let _w = Math.floor((x2 - this.minX) * this.ratioX + padding.left) - _x;

            let _h = (y - this.minY) * this.ratioY;

            let _y = Math.floor(this.viewHeight + padding.top - _h);

            drawRect(ctx, [_x, _y, _w, _h], {
              fill: color,
              color: stroke
            });
          }
        }
      }

      add(index, [x1, x2, y], shift = false) {
        this.addPoint(index, [x1, x2, y], shift);
        this.minX = this.data[index][0][0];
        this.maxX = x2;
        if (y < this.minY) this.minY = y;
        if (y > this.maxY) this.maxY = y;
        this.resize();
      }

      draw() {
        super.draw();
        this.calcRatio();
        this.axisXY();
        this.bars();
        this.cross();
        this.legend();
      }

    }
    Object.assign(HistogramChart.prototype, MixinCross);
    Object.assign(HistogramChart.prototype, MixinAxis);
    Object.assign(HistogramChart.prototype, MixinAddPoint);
    const histogramChart = (el, data, options) => new HistogramChart(el, data, options);

    const defaultLineChartOptions = {
      hoverMode: 'default',
      // default, advanced
      axis: defaultAxis,
      cross: defaultCross,
      showDots: true,
      type: 'line',
      // line, curve
      accuracy: 2,
      lines: [],
      arrows: defaultArrows
    };

    const drawCurve = (ctx, coords = [], {
      color = '#000',
      size = 1,
      dash = [],
      tension = 0.25
    } = {}) => {
      ctx.beginPath();
      ctx.save();
      ctx.setLineDash(dash);
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
      ctx.moveTo(coords[0][0], coords[0][1]);

      for (let i = 0; i < coords.length - 1; i++) {
        let x_mid = (coords[i][0] + coords[i + 1][0]) / 2;
        let y_mid = (coords[i][1] + coords[i + 1][1]) / 2;
        let cp_x1 = (x_mid + coords[i][0]) / 2; //let cp_y1 = (y_mid + coords[i][1]) / 2;

        let cp_x2 = (x_mid + coords[i + 1][0]) / 2; //let cp_y2 = (y_mid + coords[i + 1][1]) / 2;

        ctx.quadraticCurveTo(cp_x1, coords[i][1], x_mid, y_mid);
        ctx.quadraticCurveTo(cp_x2, coords[i + 1][1], coords[i + 1][0], coords[i + 1][1]);
      }

      ctx.stroke();
      ctx.restore();
      ctx.closePath();
    };

    const mergeProps = (...args) => {
      let result = {};
      args.forEach(v => {
        if (v && isObject(v)) Object.assign(result, v);
      });
      return result;
    };

    const DEFAULT_LINE_TYPE = 'line';
    const DEFAULT_DOT_TYPE = 'circle';
    const DOT_TRIANGLE = 'triangle';
    const DOT_SQUARE = 'square';
    const DOT_DIAMOND = 'diamond';
    const VALUE_DEFAULT = 'default';
    class LineChart extends Chart {
      constructor(el, data = [], options = {}) {
        super(el, data, merge({}, defaultLineChartOptions, options), 'line');
        this.coords = {};
        this.minX = 0;
        this.maxX = 0;
        this.minY = 0;
        this.maxY = 0;
        this.legendItems = [];
        const legend = this.options.legend;
        const lines = this.options.lines;
        const colors = this.options.colors;

        if (legend) {
          for (let i = 0; i < lines.length; i++) {
            this.legendItems.push([lines[i].name, colors[i]]);
          }
        }

        this.calcMinMax();
        this.resize();
      }

      calcMinMax() {
        const o = this.options;
        let a = [];

        for (let _data of this.data) {
          if (!Array.isArray(_data)) continue;

          for (const [x, y] of _data) {
            a.push([x, y]);
          }
        }

        const [minX, maxX] = minMax(a, 'x');
        const [minY, maxY] = minMax(a, 'y');
        this.minX = o.boundaries && !isNaN(o.boundaries.minX) ? o.boundaries.minX : minX;
        this.maxX = o.boundaries && !isNaN(o.boundaries.maxX) ? o.boundaries.maxX : maxX;
        this.minY = o.boundaries && !isNaN(o.boundaries.minY) ? o.boundaries.minY : minY;
        this.maxY = o.boundaries && !isNaN(o.boundaries.maxY) ? o.boundaries.maxY : maxY;
        if (isNaN(this.minX)) this.minX = 0;
        if (isNaN(this.maxX)) this.maxX = 100;
        if (isNaN(this.minY)) this.minX = 0;
        if (isNaN(this.maxY)) this.maxX = 100;
      }

      calcRatio() {
        this.ratioX = this.viewWidth / (this.maxX === this.minX ? this.maxX : this.maxX - this.minX);
        this.ratioY = this.viewHeight / (this.maxY === this.minY ? this.maxY : this.maxY - this.minY);
      }

      lines() {
        const o = this.options,
              padding = expandPadding(o.padding);
        const ctx = this.ctx;
        let coords;
        if (!this.data || !this.data.length) return;

        for (let i = 0; i < this.data.length; i++) {
          const line = o.lines[i];
          const data = this.data[i];
          const color = o.colors[i];
          const type = line.type || o.type || DEFAULT_LINE_TYPE;
          coords = [];

          for (const [x, y] of data) {
            let _x = Math.floor((x - this.minX) * this.ratioX + padding.left);

            let _y = Math.floor(this.viewHeight + padding.top - (y - this.minY) * this.ratioY);

            coords.push([_x, _y, x, y]);
          }

          if (line.showLine !== false) {
            if (type !== DEFAULT_LINE_TYPE) {
              drawCurve(ctx, coords, {
                color: color,
                size: line.size
              });
            } else {
              drawLine(ctx, coords, {
                color: color,
                size: line.size
              });
            }
          }

          let dots = mergeProps({
            type: DEFAULT_DOT_TYPE
          }, o.dots, line.dots);
          let opt = {
            color: dots.color ?? color,
            fill: dots.fill ?? color,
            radius: dots.size ?? 2
          };
          let drawPointFn;

          switch (dots.type) {
            case DOT_SQUARE:
              drawPointFn = drawSquare;
              break;

            case DOT_TRIANGLE:
              drawPointFn = drawTriangle;
              break;

            case DOT_DIAMOND:
              drawPointFn = drawDiamond;
              break;

            default:
              drawPointFn = drawCircle;
          }

          if (line.dots && o.showDots !== false) {
            coords.map(([x, y]) => {
              drawPointFn(ctx, [x, y, opt.radius], opt);
            });
          }

          this.coords[line.name] = {
            line,
            coords,
            drawPointFn,
            opt
          };
        }
      }

      floatPoint() {
        const o = this.options;
        const ctx = this.ctx;
        const rect = this.canvas.getBoundingClientRect();
        let tooltip = false;
        if (!this.data || !this.data.length) return;
        if (!this.proxy.mouse) return;
        let {
          x,
          y
        } = this.proxy.mouse;
        const mx = x - rect.left;
        const my = y - rect.top;

        for (const name in this.coords) {
          const item = this.coords[name];
          const drawPointFn = item.drawPointFn;
          const opt = item.opt; // const graph = item.graph

          for (const [px, py, _x, _y] of item.coords) {
            const accuracy = +(o.accuracy || opt.radius);
            const lx = px - accuracy,
                  rx = px + accuracy;
            const ly = py - accuracy,
                  ry = py + accuracy;

            if (mx > lx && mx < rx && o.hoverMode !== VALUE_DEFAULT) {
              drawPointFn(ctx, [px, py, opt.radius], {
                color: opt.color,
                fill: opt.fill
              });
            }

            if (mx > lx && mx < rx && my > ly && my < ry) {
              if (o.hoverMode === VALUE_DEFAULT) drawPointFn(ctx, [px, py, opt.radius * 2], {
                color: opt.color,
                fill: opt.fill
              });

              if (o.tooltip) {
                this.showTooltip([_x, _y], item.graph);
                tooltip = true;
              }

              break;
            }
          }

          if (!tooltip && this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
          }
        }
      }

      add(index, [x, y], shift, align) {
        this.addPoint(index, [x, y], shift);
        this.minX = this.data[index][0][0];
        this.maxX = x;

        if (align) {
          if (isObject(align)) {
            this.align(align);
          }
        } else {
          if (y < this.minY) this.minY = y;
          if (y > this.maxY) this.maxY = y;
        }

        this.resize();
      }

      align({
        minX,
        maxX,
        minY,
        maxY
      }) {
        let a = [];

        for (let _data of this.data) {
          if (!Array.isArray(_data)) continue;

          for (const [x, y] of _data) {
            a.push([x, y]);
          }
        }

        const [_minX, _maxX] = minMax(a, 'x');
        const [_minY, _maxY] = minMax(a, 'y');
        if (minX) this.minX = _minX;
        if (minY) this.minY = _minY;
        if (maxX) this.maxX = _maxX;
        if (maxY) this.maxY = _maxY;
      }

      draw() {
        super.draw();
        this.calcRatio();
        this.axisXY();
        this.arrows();
        this.lines();
        this.floatPoint();
        this.cross();
        this.legend();
      }

    }
    Object.assign(LineChart.prototype, MixinCross);
    Object.assign(LineChart.prototype, MixinAxis);
    Object.assign(LineChart.prototype, MixinAddPoint);
    Object.assign(LineChart.prototype, MixinArrows);
    const lineChart = (el, data, options) => new LineChart(el, data, options);

    const defaultPieChartOptions = {
      other: {
        color: '#eaeaea'
      },
      labels: {
        font: labelFont,
        color: '#fff'
      },
      showValue: false,
      padding: 0,
      onDrawValue: null
    };

    const drawSector = (ctx, [x, y, radius = 4, startAngle, endAngle], {
      color = '#000',
      fill = '#fff',
      size = 1
    } = {}) => {
      ctx.beginPath();
      ctx.save();
      ctx.setLineDash([]);
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
      ctx.fillStyle = fill;
      ctx.arc(x, y, radius, startAngle, endAngle);
      ctx.lineTo(x, y);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      ctx.closePath();
    };

    class PieChart extends Chart {
      constructor(el, data, options) {
        super(el, data, merge({}, defaultPieChartOptions, options), 'pie');
        this.total = this.data.reduce((acc, curr) => acc + curr, 0);
        this.legendItems = [];
        const legend = this.options.legend;

        if (legend && legend.titles && legend.titles.length) {
          for (let i = 0; i < legend.titles.length; i++) {
            this.legendItems.push([legend.titles[i], this.options.colors[i], this.data[i]]);
          }
        }

        this.resize();
      }

      sectors() {
        const ctx = this.ctx,
              o = this.options;
        let [x, y] = this.center;
        const radius = this.radius;
        let startAngle = 0,
            endAngle = 360,
            offset = 0,
            textVal = '';
        let textX, textY;
        if (!this.data || !this.data.length) return;

        for (let i = 0; i < this.data.length; i++) {
          let val = this.data[i];
          let color = o.colors[i];
          endAngle = 2 * Math.PI * val / this.total;
          drawSector(ctx, [x, y, radius, startAngle, startAngle + endAngle], {
            fill: color,
            color: color
          });
          startAngle += endAngle;
        }

        startAngle = 0;

        for (let i = 0; i < this.data.length; i++) {
          let val = this.data[i],
              percent;
          let name = (this.legendItems[i] && this.legendItems[i][0]) ?? "";
          endAngle = 2 * Math.PI * val / this.total;
          offset = 0;
          percent = Math.round(val * 100 / this.total);
          textVal = o.showValue ? val : percent + "%";

          if (typeof o.onDrawValue === 'function') {
            textVal = o.onDrawValue.apply(null, [name, val, percent]);
          }

          textX = x + (radius / 2 + offset) * Math.cos(startAngle + endAngle / 2);
          textY = y + (radius / 2 + offset) * Math.sin(startAngle + endAngle / 2);
          let textW = getTextBoxWidth(ctx, [val + "%"], {
            font: o.labels.font
          });
          drawText(ctx, textVal, [textX - textW / 2, textY + o.labels.font.size / 2], {
            color: o.labels.color,
            font: o.labels.font
          });
          startAngle += endAngle;
        }
      }

      draw() {
        super.draw();
        this.sectors();
        this.legend();
      }

      resize() {
        super.resize();
        this.center = [this.dpiWidth / 2, this.dpiHeight / 2];
      }

    }
    const pieChart = (el, data, options) => new PieChart(el, data, options);

    const defaultStackedBarChartOptions = {
      groupDistance: 0,
      axis: defaultAxis,
      dataAxisX: false,
      arrows: defaultArrows,
      onDrawLabel: null
    };

    class StackedBarChart extends Chart {
      constructor(el, data, options) {
        super(el, data, merge({}, defaultStackedBarChartOptions, options), 'stacked-bar');
        this.barWidth = 0;
        this.maxY = 0;
        this.maxX = 0;
        this.minY = 0;
        this.minX = 0;
        this.viewAxis = this.options.dataAxisX ? this.viewHeight : this.viewWidth;
        this.ratioX = 0;
        this.ratioY = 0;
        this.legendItems = [];
        const legend = this.options.legend;

        if (legend && legend.titles && legend.titles.length) {
          for (let i = 0; i < legend.titles.length; i++) {
            this.legendItems.push([legend.titles[i], this.options.colors[i]]);
          }
        }

        this.calcMinMax();
        this.resize();
      }

      calcMinMax() {
        const o = this.options;
        let a = [];

        for (let k in this.data) {
          let data = this.data[k].data;
          a.push(data.reduce((a, b) => a + b, 0));
        }

        const [, max] = minMaxLinear(a);
        this.maxX = this.maxY = o.boundaries && !isNaN(o.boundaries.max) ? o.boundaries.maxY : max;
        if (isNaN(this.maxX)) this.maxX = 100;
        if (isNaN(this.maxY)) this.maxX = 100;
      }

      calcRatio() {
        this.ratio = this.ratioY = this.ratioX = (this.options.dataAxisX ? this.viewWidth : this.viewHeight) / (this.maxY === this.minY ? this.maxY : this.maxY - this.minY);
      }

      calcBarWidth() {
        const o = this.options;
        let bars = this.data.length;
        let availableSpace = (o.dataAxisX ? this.viewHeight : this.viewWidth) - (this.data.length + 1) * o.groupDistance; // space between groups

        this.barWidth = availableSpace / bars;
      }

      barsX() {
        const o = this.options;
        const padding = expandPadding(o.padding);
        const ctx = this.ctx;
        let px, py;
        const rect = this.canvas.getBoundingClientRect();
        let mx, my;
        let tooltip = false;
        if (!this.data || !this.data.length) return;

        if (this.proxy.mouse) {
          mx = this.proxy.mouse.x - rect.left;
          my = this.proxy.mouse.y - rect.top;
        }

        px = padding.left;
        py = padding.top + o.groupDistance;
        let colors = Array.isArray(o.colors) ? o.colors : o.colors.split(",").map(c => c.trim());

        for (const graph of this.data) {
          let data = graph.data;
          let name = graph.name;
          let labelColor = colors.length > 1 ? o.color : colors[0]; // ???

          let sigma = 0;

          for (let i = 0; i < data.length; i++) {
            let delta = data[i] * this.ratio;
            let color = colors[i];
            let fill = colors[i];
            let valueTitle = o.values[i];
            drawRect(ctx, [px + sigma, py, delta, this.barWidth], {
              color,
              fill
            });

            if (mx > px + sigma && mx < px + delta + sigma && my > py && my < py + this.barWidth) {
              drawRect(ctx, [px + sigma, py, delta, this.barWidth - 1], {
                color: 'rgba(255,255,255,.3)',
                fill: 'rgba(255,255,255,.3)'
              });

              if (o.tooltip) {
                this.showTooltip([valueTitle, data[i]], graph);
                tooltip = true;
              }
            }

            sigma += delta;
          }

          py += o.groupDistance + this.barWidth;

          if (typeof o.onDrawLabel === 'function') {
            name = o.onDrawLabel.apply(null, name);
          }

          drawText(ctx, name, [0, 0], {
            align: 'center',
            color: labelColor,
            stroke: labelColor,
            font: o.font,
            translate: [px - 20, py - this.barWidth / 2],
            angle: 90
          });
        }

        if (!tooltip && this.tooltip) {
          this.tooltip.remove();
          this.tooltip = null;
        }
      }

      barsY() {
        const o = this.options;
        const padding = expandPadding(o.padding);
        const ctx = this.ctx;
        let px, py;
        const rect = this.canvas.getBoundingClientRect();
        let mx, my;
        let tooltip = false;
        if (!this.data || !this.data.length) return;

        if (this.proxy.mouse) {
          mx = this.proxy.mouse.x - rect.left;
          my = this.proxy.mouse.y - rect.top;
        }

        px = padding.left + o.groupDistance;
        py = this.viewHeight + padding.top;
        let colors = Array.isArray(o.colors) ? o.colors : o.colors.split(",").map(c => c.trim());

        for (const graph of this.data) {
          let data = graph.data;
          let name = graph.name;
          let labelColor = colors.length > 1 ? o.color : colors[0];
          let sigma = 0;

          for (let i = 0; i < data.length; i++) {
            let delta = data[i] * this.ratio;
            let color = colors[i];
            let fill = colors[i];
            let valueTitle = o.values[i];
            drawRect(ctx, [px, py - delta - sigma, this.barWidth, delta], {
              color,
              fill
            });

            if (mx > px && mx < px + this.barWidth - 1 && my > py - delta - sigma && my < py - sigma) {
              drawRect(ctx, [px, py - delta - sigma, this.barWidth, delta], {
                color: 'rgba(255,255,255,.3)',
                fill: 'rgba(255,255,255,.3)'
              });

              if (o.tooltip) {
                this.showTooltip([valueTitle, data[i]], graph);
                tooltip = true;
              }
            }

            sigma += delta;
          }

          px += o.groupDistance + this.barWidth;

          if (typeof o.onDrawLabel === 'function') {
            name = o.onDrawLabel.apply(null, name);
          }

          drawText(ctx, name, [0, 0], {
            align: 'center',
            color: labelColor,
            stroke: labelColor,
            font: o.font,
            translate: [px - o.groupDistance - this.barWidth / 2, py + 20],
            angle: 0
          });
        }

        if (!tooltip && this.tooltip) {
          this.tooltip.remove();
          this.tooltip = null;
        }
      }

      draw() {
        const o = this.options;
        super.draw();
        this.calcBarWidth();
        this.calcRatio();

        if (o.dataAxisX) {
          this.axisX();
          this.barsX();
        } else {
          this.axisY();
          this.barsY();
        }

        this.arrows();
        this.legend();
      }

    }
    Object.assign(StackedBarChart.prototype, MixinAxis);
    Object.assign(StackedBarChart.prototype, MixinArrows);
    const stackedBarChart = (el, data, options) => new StackedBarChart(el, data, options);

    const gaugeLabel = {
      font: defaultFont,
      fixed: false,
      color: "#000",
      angle: 0,
      shift: {
        x: 0,
        y: 0
      }
    };
    const defaultGaugeOptions = {
      backStyle: "#a7a7a7",
      fillStyle: "#8f8",
      startFactor: 0.85,
      endFactor: 0.15,
      backWidth: 32,
      valueWidth: 32,
      radius: 100,
      boundaries: {
        min: 0,
        max: 100
      },
      value: gaugeLabel,
      label: {
        min: gaugeLabel,
        max: gaugeLabel
      },
      padding: {
        left: 0,
        right: 0
      }
    };

    const drawArc = (ctx, [x, y, radius, startAngle, endAngle], {
      stroke = '#000',
      fill = '#fff',
      size = 1,
      dash = []
    } = {}) => {
      ctx.beginPath();
      ctx.save();
      ctx.setLineDash(dash);
      ctx.lineWidth = size;
      ctx.strokeStyle = stroke;
      ctx.fillStyle = fill;
      ctx.arc(x, y, radius, startAngle, endAngle);
      ctx.stroke();
      ctx.restore();
      ctx.closePath();
    };

    const getFillColor = (p, colors) => {
      let res = '#fff',
          min = 0;

      for (let i = 0; i < colors.length; i++) {
        let c = colors[i][0];

        if (p >= min && p <= c) {
          res = colors[i][1];
          min = colors[i][0];
        }
      }

      return res;
    };

    class Gauge extends Chart {
      constructor(el, data, options) {
        super(el, data, merge({}, defaultGaugeOptions, options), 'gauge');
        this.min = this.options.boundaries.min;
        this.max = this.options.boundaries.max;
        this.resize();
      }

      gauge() {
        const ctx = this.ctx,
              o = this.options,
              padding = expandPadding(o.padding);
        let [x, y] = this.center;
        x += padding.left;
        y += padding.top;
        const PI = Math.PI,
              min = PI * o.startFactor,
              max = PI * (2 + o.endFactor);
        const r = o.radius * this.radius / 100 - o.backWidth;
        let v = this.data[0],
            p = Math.round(Math.abs(100 * (v - this.min) / (this.max - this.min)));
        const val = min + (max - min) * p / 100;
        let textVal = p;
        let colors = [];

        if (typeof o.onDrawValue === 'function') {
          textVal = o.onDrawValue.apply(null, [v, p]);
        }

        drawArc(ctx, [x, y, r, min, max], {
          size: o.backWidth,
          stroke: o.backStyle
        });

        if (typeof o.fillStyle === "string") {
          colors.push([100, o.fillStyle]);
        } else if (Array.isArray(o.fillStyle)) {
          for (let c of o.fillStyle) {
            colors.push(c);
          }
        }

        drawArc(ctx, [x, y, r, min, val], {
          size: o.valueWidth,
          stroke: getFillColor(p, colors)
        });
        drawText(ctx, textVal, [0, 0], {
          align: "center",
          baseLine: "middle",
          color: o.value.color,
          stroke: o.value.color,
          font: o.value.font || o.font,
          translate: [x + o.value.shift.x, y + o.value.shift.y],
          angle: o.value.angle
        });

        if (o.label.min) {
          drawText(ctx, o.boundaries.min, [0, 0], {
            align: "left",
            baseLine: "middle",
            color: o.label.min.color,
            stroke: o.label.min.color,
            font: o.label.min.font || o.font,
            translate: [x + r * Math.cos(min) + o.backWidth + o.label.min.shift.x, y + r * Math.sin(min) + o.label.min.shift.y],
            angle: 0
          });
        }

        if (o.label.max) {
          drawText(ctx, o.boundaries.max, [0, 0], {
            align: "right",
            baseLine: "middle",
            color: o.label.max.color,
            stroke: o.label.max.color,
            font: o.label.max.font || o.font,
            translate: [x + r * Math.cos(max) - o.backWidth + o.label.max.shift.x, y + r * Math.sin(max) + o.label.max.shift.y],
            angle: 0
          });
        }
      }

      draw() {
        super.draw();
        this.gauge();
      }

      update(val, {
        min = null,
        max = null
      } = {}) {
        this.data[0] = val;
        if (min !== null) this.min = min;
        if (max !== null) this.max = max;
        this.resize();
      }

    }
    const gauge = (el, data, options) => new Gauge(el, data, options);

    const donutLabel = {
      font: defaultFont,
      fixed: false,
      color: "#000",
      angle: 0,
      shift: {
        x: 0,
        y: 0
      }
    };
    const defaultDonutOptions = {
      backStyle: "#a7a7a7",
      fillStyle: "#8f8",
      backWidth: 100,
      valueWidth: 100,
      radius: 100,
      boundaries: {
        min: 0,
        max: 100
      },
      label: donutLabel,
      padding: 0
    };

    class Donut extends Chart {
      constructor(el, data, options) {
        super(el, data, merge({}, defaultDonutOptions, options), 'donut');
        this.total = this.data.reduce((acc, curr) => acc + curr, 0);
        this.min = this.options.boundaries.min;
        this.max = this.options.boundaries.max;
        this.legendItems = [];
        const legend = this.options.legend;

        if (legend && legend.titles && legend.titles.length) {
          for (let i = 0; i < legend.titles.length; i++) {
            this.legendItems.push([legend.titles[i], this.options.colors[i], this.data[i]]);
          }
        }

        this.resize();
      }

      gauge() {
        const ctx = this.ctx,
              o = this.options;
        let [x, y] = this.center;
        const PI = Math.PI;
        const radius = this.radius - o.backWidth / 2;
        drawArc(ctx, [x, y, radius, 0, 2 * PI], {
          size: o.backWidth,
          stroke: o.backStyle
        });
        let startAngle = 0,
            endAngle = 0;

        for (let i = 0; i < this.data.length; i++) {
          const color = o.colors[i];
          let val = this.data[i];
          endAngle = 2 * Math.PI * val / this.total;
          drawArc(ctx, [x, y, radius, startAngle, startAngle + endAngle], {
            size: o.valueWidth,
            stroke: color
          });

          if (o.label) {
            let name = (this.legendItems[i] && this.legendItems[i][0]) ?? "";
            const percent = Math.round(val * 100 / this.total);
            let textVal = o.showValue ? val : percent + "%";
            let textX, textY;

            if (typeof o.onDrawValue === 'function') {
              textVal = o.onDrawValue.apply(null, [name, val, percent]);
            }

            textX = x + radius * Math.cos(startAngle + endAngle / 2);
            textY = y + radius * Math.sin(startAngle + endAngle / 2);
            drawText(ctx, textVal, [textX, textY], {
              color: o.label.color,
              font: o.label.font
            });
          }

          startAngle += endAngle;
        }
      }

      draw() {
        super.draw();
        this.gauge();
        this.legend();
      }

      resize() {
        super.resize();
        this.center = [this.dpiWidth / 2, this.dpiHeight / 2];
      }

    }
    const donut = (el, data, options) => new Donut(el, data, options);

    const defaultSegmentOptions = {
      segment: {
        count: 100,
        distance: 4,
        rowDistance: 4,
        height: "auto",
        radius: 0
      },
      ghost: {
        color: "#f1f1f1"
      },
      colors: [[70, '#60a917'], [90, '#f0a30a'], [100, '#a20025']],
      padding: 0,
      margin: 0
    };

    const drawRoundedRect = (ctx, [x, y, width, height], {
      color = '#000',
      fill = '#fff',
      size = 1,
      dash = [],
      radius = 4
    } = {}) => {
      if (typeof radius === 'number') {
        radius = {
          tl: radius,
          tr: radius,
          br: radius,
          bl: radius
        };
      } else {
        const defaultRadius = {
          tl: 0,
          tr: 0,
          br: 0,
          bl: 0
        };

        for (let side in defaultRadius) {
          radius[side] = radius[side] || defaultRadius[side];
        }
      }

      ctx.beginPath();
      ctx.fillStyle = fill;
      ctx.strokeStyle = color;
      ctx.moveTo(x + radius.tl, y);
      ctx.lineTo(x + width - radius.tr, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
      ctx.lineTo(x + width, y + height - radius.br);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
      ctx.lineTo(x + radius.bl, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
      ctx.lineTo(x, y + radius.tl);
      ctx.quadraticCurveTo(x, y, x + radius.tl, y);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    };

    class Segment extends Chart {
      constructor(el, data, options) {
        super(el, data, merge({}, defaultSegmentOptions, options), 'segment');
        this.min = 0;
        this.max = 100;

        if (this.options.segment.height !== "auto") {
          const o = this.options;
          const s = o.segment;
          const rowDistance = s.rowDistance * o.dpi;
          this.options.height = this.data.length * (rowDistance + 1 + s.height);
        }

        this.resize();
      }

      segments() {
        const ctx = this.ctx,
              o = this.options,
              s = o.segment;
        const count = s.count ? s.count : 20;
        const distance = s.distance * o.dpi;
        const rowDistance = s.rowDistance * o.dpi;
        const width = this.viewWidth / count - distance;
        const colors = [];
        const padding = expandPadding(o.padding);
        let x,
            y = padding.top + distance;
        let height;

        if (s.height === 'auto') {
          height = (o.height - rowDistance * this.data.length) / this.data.length;
        } else {
          height = s.height;
        }

        if (typeof o.colors === "string") {
          colors.push([100, o.colors]);
        } else if (Array.isArray(o.colors)) {
          for (let c of o.colors) {
            colors.push(c);
          }
        }

        for (let k = 0; k < this.data.length; k++) {
          const value = this.data[k];
          const limit = count * value / 100;
          x = padding.left + 1;

          for (let i = 0; i < count; i++) {
            const color = getFillColor(i * 100 / count, colors);

            if (i <= limit) {
              drawRoundedRect(ctx, [x, y, width, height], {
                color,
                fill: color,
                radius: s.radius
              });
            } else {
              if (o.ghost) {
                drawRoundedRect(ctx, [x, y, width, height], {
                  color: o.ghost.color,
                  fill: o.ghost.color,
                  radius: s.radius
                });
              }
            }

            x += width + distance;
          }

          y += height + rowDistance;
        }
      }

      setData(data, index = 0, redraw = true) {
        this.data[index] = data;
        if (redraw) this.resize();
      }

      draw() {
        super.draw();
        this.segments();
      }

    }
    const segment = (el, data, options) => new Segment(el, data, options);

    const defaultCandlestickOptions = {
      axis: defaultAxis,
      boundaries: {
        minY: 0
      },
      candle: {
        size: 1,
        width: 'auto',
        white: 'green',
        black: 'red',
        distance: 4,
        cutoff: false
      },
      ghost: {
        stroke: "#e3e3e3",
        fill: "#e3e3e3"
      },
      arrows: defaultArrows
    };

    const drawCandle = (ctx, [x, y, h, by, bw, bh], {
      color = 'red',
      size = 1,
      leg = false
    } = {}) => {
      ctx.beginPath();
      ctx.save();
      ctx.setLineDash([]);
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + h);

      if (leg) {
        ctx.moveTo(x - bw / 2, y);
        ctx.lineTo(x + bw / 2, y);
        ctx.moveTo(x - bw / 2, y + h);
        ctx.lineTo(x + bw / 2, y + h);
      }

      ctx.rect(x - bw / 2, by, bw, bh);
      ctx.stroke();
      ctx.fill();
      ctx.restore();
      ctx.closePath();
    };

    class CandlestickChart extends Chart {
      constructor(el, data, options) {
        super(el, data, merge({}, defaultCandlestickOptions, options), 'candlesticks');
        this.minY = 0;
        this.maxY = 0;
        this.labels = [];
        this.coords = [];
        this.calcMinMax();
        this.resize();
      }

      calcMinMax() {
        const o = this.options;
        let a = [];
        this.labels.length = 0;

        for (let k in this.data) {
          const [x, hi, low] = this.data[k];
          a.push([0, hi]);
          a.push([0, low]);
          this.labels.push(x);
        }

        const [minY, maxY] = minMax(a, 'y');
        this.minY = o.boundaries && !isNaN(o.boundaries.minY) ? o.boundaries.minY : minY;
        this.maxY = o.boundaries && !isNaN(o.boundaries.maxY) ? o.boundaries.maxY : maxY;
      }

      calcRatio() {
        this.ratioY = this.viewHeight / (this.maxY === this.minY ? this.maxY : this.maxY - this.minY);
      }

      getCandleSize() {
        const candle = this.options.candle;
        const dataLength = this.data.length;
        return candle.width === 'auto' ? (this.viewWidth - candle.distance * 2 - candle.distance * (dataLength - 1)) / dataLength : candle.width;
      }

      candlesticks() {
        // data [x, hi, low, open, close]
        const ctx = this.ctx,
              o = this.options,
              candle = o.candle,
              ghost = o.ghost;
        const padding = expandPadding(o.padding);
        const dataLength = this.data.length;
        const rect = this.canvas.getBoundingClientRect();
        let candleSize = this.getCandleSize();
        let mx,
            my,
            tooltip = false;

        if (this.proxy.mouse) {
          mx = this.proxy.mouse.x - rect.left;
          my = this.proxy.mouse.y - rect.top;
        }

        let x = padding.left + candleSize / 2 + candle.distance;
        this.coords.length = 0;

        for (let i = 0; i < dataLength; i++) {
          let y,
              y2,
              o1,
              c1,
              [xv, hi, low, open, close] = this.data[i];
          const whiteCandle = close > open;
          let candleColor = whiteCandle ? candle.white : candle.black;
          let bx1 = x - candleSize / 2 - candle.distance / 2,
              bx2 = x + candleSize / 2 + candle.distance / 2;
          y = padding.top + this.viewHeight - (hi - this.minY) * this.ratioY;
          y2 = padding.top + this.viewHeight - (low - this.minY) * this.ratioY;
          o1 = padding.top + this.viewHeight - (open - this.minY) * this.ratioY;
          c1 = padding.top + this.viewHeight - (close - this.minY) * this.ratioY;

          if (mx >= bx1 && mx <= bx2) {
            drawRect(ctx, [bx1, padding.top, candleSize + candle.distance, this.viewHeight], {
              color: ghost.stroke,
              fill: ghost.fill
            });
          }

          drawCandle(ctx, [x, y, y2 - y, o1, candleSize, c1 - o1], {
            color: candleColor,
            size: candle.size,
            leg: candle.leg
          });

          if (mx >= bx1 && mx <= bx2 && my >= y && my <= y2) {
            if (o.tooltip) {
              this.showTooltip(this.data[i], {
                type: whiteCandle
              });
              tooltip = true;
            }
          }

          this.coords.push(x);
          x += candleSize + candle.distance;
        }

        if (!tooltip && this.tooltip) {
          this.tooltip.remove();
          this.tooltip = null;
        }
      }

      axis() {
        // draw default axis Y
        this.axisY(); // draw axis X

        const ctx = this.ctx,
              o = this.options,
              candle = o.candle;
        const padding = expandPadding(o.padding);
        const axis = o.axis.x,
              label = axis.label,
              line = axis.line,
              arrow = axis.arrow;
        const font = (label && label.font) ?? o.font;
        let shortLineSize = line.shortLineSize ?? 0;
        const candleSize = this.getCandleSize();
        let x = padding.left + candleSize / 2 + candle.distance,
            y = padding.top + this.viewHeight;
        let k = 0;

        for (let i = 0; i < this.labels.length; i++) {
          let value = this.labels[i];
          let labelValue = value;

          if (typeof o.onDrawLabelX === "function") {
            labelValue = o.onDrawLabelX.apply(null, [value]);
          }

          if (i !== 0 && label.skip && k !== label.skip) {
            k++;
          } else {
            k = 1; // short line

            drawVector(ctx, [x, y - shortLineSize, x, y + shortLineSize], {
              color: arrow && arrow.color ? arrow.color : line.color
            }); // label

            drawText(ctx, labelValue.toString(), [0, 0], {
              color: label.color ?? o.color,
              align: label.align,
              font,
              translate: [x + (label.shift.x ?? 0), y + font.size + 5 + (label.shift.y ?? 0)],
              angle: label.angle
            });
          }

          x += candleSize + candle.distance;
        }
      }

      add([x, hi, low, open, close], shift = false) {
        const o = this.options;
        let data;

        if (!this.data) {
          this.data = [];
        }

        data = this.data;

        if (shift && data.length) {
          if (!o.graphSize) {
            data = data.slice(1);
          } else {
            if (data.length >= o.graphSize) {
              data = data.slice(1);
            }
          }
        }

        this.data = data;
        this.data.push([x, hi, low, open, close]);
        this.calcMinMax();
        this.resize();
      }

      draw() {
        super.draw();
        this.calcRatio();
        this.axis();
        this.arrows();
        this.candlesticks();
      }

    }
    Object.assign(CandlestickChart.prototype, MixinAxis);
    Object.assign(CandlestickChart.prototype, MixinTooltip);
    Object.assign(CandlestickChart.prototype, MixinArrows);
    const candlestickChart = (el, data, options) => new CandlestickChart(el, data, options);

    globalThis.chart = {
      areaChart,
      barChart,
      bubbleChart,
      histogramChart,
      lineChart,
      pieChart,
      stackedBarChart,
      gauge,
      donut,
      segment,
      candlestickChart,
      defaultColors
    };

})();
