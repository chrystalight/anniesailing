(function () {
  var F = window.FINANCES;
  if (!F) return;
  var COLORS = {
    "Flights": "#C81E29", "Accommodation": "#2F6F8F", "Coaching fees": "#D9A441",
    "Food": "#6B8F5E", "Equipment": "#7A5C9E", "Registration": "#E07A3F",
    "Physio/gym": "#3FA7A0", "Other": "#8A8A80"
  };
  var cats = F.categories;
  var NS = "http://www.w3.org/2000/svg";
  var el = function (id) { return document.getElementById(id); };
  var sum = function (a) { return a.reduce(function (x, y) { return x + y; }, 0); };
  var fmt = function (n, d) { return n.toLocaleString("en-CA", { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); };
  var money = function (n) { return "$" + fmt(n); };
  var money2 = function (n) { return "$" + fmt(n, 2); };
  var approx = function (n, step) { return "~$" + fmt(Math.round(n / step) * step); };

  if (F.notice) { el("notice").textContent = F.notice; el("notice").hidden = false; }
  el("period").textContent = F.period;

  // ---- actual months, average, estimated months
  var actual = F.months;
  var base = actual.filter(function (m) { return !m.noBaseline; });
  var nA = base.length;
  // typical month = average of recorded months, with optional adjustments
  var adjust = F.baselineAdjust || [];
  var monthTotal = function (m) { return sum(cats.map(function (c) { return m.spent[c] || 0; })); };
  var factorOf = function (m) {
    var f = 1;
    adjust.forEach(function (a) { if (a.month === m.label) f = (monthTotal(m) - a.subtract) / monthTotal(m); });
    return f;
  };
  var factors = base.map(factorOf);
  var avgBy = {};
  cats.forEach(function (c) {
    avgBy[c] = sum(base.map(function (m, i) { return (m.spent[c] || 0) * factors[i]; })) / nA;
  });
  var avgTotal = sum(cats.map(function (c) { return avgBy[c]; }));
  var est = (F.estimateMonths || []).map(function (spec) {
    if (typeof spec === "string") spec = { label: spec };
    var spent = {};
    cats.forEach(function (c) { spent[c] = avgBy[c]; });
    (spec.exclude || []).forEach(function (name) {
      (F.examples || []).forEach(function (ex, i) {
        if (ex.noBaseline) return;
        ex.items.forEach(function (it) {
          if (it.vendor === name) spent[it.category] -= it.amount * (factors[i] || 1) / nA;
        });
      });
    });
    Object.keys(spec.scale || {}).forEach(function (c) {
      var ref = spec.scale[c];
      var m = actual.filter(function (x) { return x.label === ref[0]; })[0];
      if (m) spent[c] = (m.spent[c] || 0) * ref[1];
    });
    (spec.zero || []).forEach(function (c) { spent[c] = 0; });
    if (spec.zeroAll) cats.forEach(function (c) { spent[c] = (spec.keep || []).indexOf(c) >= 0 ? avgBy[c] : 0; });
    if (spec.factor) cats.forEach(function (c) { spent[c] *= spec.factor; });
    return { label: spec.label, spent: spent, est: true };
  });
  // scale a category's estimated months so it makes up a set share of the total
  Object.keys(F.shareTarget || {}).forEach(function (c) {
    var share = F.shareTarget[c];
    var others = sum(cats.filter(function (x) { return x !== c; }).map(function (x) {
      return sum(actual.concat(est).map(function (m) { return m.spent[x] || 0; }));
    }));
    var actualC = sum(actual.map(function (m) { return m.spent[c] || 0; }));
    var estC = sum(est.map(function (m) { return m.spent[c] || 0; }));
    var k = estC > 0 ? (share / (1 - share) * others - actualC) / estC : 1;
    if (k > 0) est.forEach(function (m) {
      m.spent = Object.assign({}, m.spent);
      m.spent[c] = (m.spent[c] || 0) * k;
    });
  });
  var all = actual.concat(est);

  var totalBy = {};
  cats.forEach(function (c) { totalBy[c] = sum(all.map(function (m) { return m.spent[c] || 0; })); });
  var total = sum(cats.map(function (c) { return totalBy[c]; }));
  var actualTotal = sum(actual.map(function (m) { return sum(cats.map(function (c) { return m.spent[c] || 0; })); }));
  var hasEst = est.length > 0;

  // ---- summary cards
  el("sum-total").textContent = hasEst ? approx(total, 1000) : money(total);
  el("sum-total-label").textContent = hasEst ? "Estimated spend so far" : "Spent so far";
  el("sum-budget").textContent = money(F.yearBudget || 0);

  // ---- monthly bars (SVG), estimated months drawn lighter
  if (el("month-chart")) (function () {
    var W = 720, H = 330, pl = 56, pr = 12, pt = 20, pb = 44;
    var totals = all.map(function (m) { return sum(cats.map(function (c) { return m.spent[c] || 0; })); });
    var max = Math.max.apply(null, totals) || 1;
    var step = Math.pow(10, Math.floor(Math.log10(max)));
    var top = Math.ceil(max / step) * step;
    var iw = W - pl - pr, ih = H - pt - pb, h = "";
    for (var i = 0; i <= 4; i++) {
      var v = top * i / 4, y = pt + ih - (v / top) * ih;
      h += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y + '" y2="' + y + '" class="grid"/>' +
           '<text x="' + (pl - 8) + '" y="' + (y + 4) + '" text-anchor="end" class="tick">' + money(v) + '</text>';
    }
    var bw = iw / all.length;
    all.forEach(function (m, idx) {
      var x = pl + idx * bw + bw * 0.15, w = bw * 0.7, yy = pt + ih;
      cats.forEach(function (c) {
        var val = m.spent[c] || 0, bh = val / top * ih;
        yy -= bh;
        h += '<rect x="' + x + '" y="' + yy + '" width="' + w + '" height="' + bh + '" fill="' + COLORS[c] + '"' +
             (m.est ? ' opacity=".4"' : '') + '><title>' + m.label + (m.est ? " (estimate)" : "") + " · " + c + ": " + money(val) + '</title></rect>';
      });
      if (m.est) h += '<rect x="' + x + '" y="' + yy + '" width="' + w + '" height="' + (pt + ih - yy) + '" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="4 3" class="estbox"/>';
      h += '<text x="' + (x + w / 2) + '" y="' + (H - 24) + '" text-anchor="middle" class="tick">' + m.label + '</text>';
      if (m.est) h += '<text x="' + (x + w / 2) + '" y="' + (H - 10) + '" text-anchor="middle" class="tick est">est.</text>';
      h += '<text x="' + (x + w / 2) + '" y="' + (yy - 6) + '" text-anchor="middle" class="tot">' + (m.est && totals[idx] > 0 ? "~" : "") + money(totals[idx]) + '</text>';
    });
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Bar chart of monthly spending by category; later months are estimates");
    svg.innerHTML = h;
    el("month-chart").appendChild(svg);
    var ml = el("month-legend");
    cats.forEach(function (c) {
      var li = document.createElement("li");
      li.innerHTML = '<i style="background:' + COLORS[c] + '"></i>' + c;
      ml.appendChild(li);
    });
    if (!hasEst) el("month-note").hidden = true;
  })();

  // ---- pie
  (function () {
    var R = 110, C = 130, ang = -Math.PI / 2, h = "";
    cats.forEach(function (c) {
      var frac = totalBy[c] / (total || 1);
      if (frac <= 0) return;
      var a2 = ang + frac * Math.PI * 2;
      var x1 = C + R * Math.cos(ang), y1 = C + R * Math.sin(ang);
      var x2 = C + R * Math.cos(a2), y2 = C + R * Math.sin(a2);
      var d = "M" + C + "," + C + " L" + x1 + "," + y1 + " A" + R + "," + R + " 0 " + (frac > 0.5 ? 1 : 0) + " 1 " + x2 + "," + y2 + " Z";
      h += '<path d="' + d + '" fill="' + COLORS[c] + '" class="slice"><title>' + c + ": " + Math.round(frac * 100) + '%</title></path>';
      ang = a2;
    });
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 260 260");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Pie chart of spending by category");
    svg.innerHTML = h;
    el("pie").appendChild(svg);
  })();

  // ---- short summary table
  (function () {
    var tb = el("summary-rows");
    var order = cats.slice().sort(function (a, b) { return totalBy[b] - totalBy[a]; });
    order.forEach(function (c) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        '<td><span class="chip"><i style="background:' + COLORS[c] + '"></i>' + c + '</span></td>' +
        '<td class="num pct">' + Math.round(totalBy[c] / (total || 1) * 100) + '%</td>' +
        '<td class="blurb">' + ((F.blurbs && F.blurbs[c]) || "") + '</td>' +
        '<td class="num">' + (hasEst ? approx(totalBy[c], 100) : money(totalBy[c])) + '</td>';
      tb.appendChild(tr);
    });
    el("summary-total").textContent = hasEst ? approx(total, 1000) : money(total);
    el("summary-est-head").textContent = hasEst ? "Estimated so far" : "Total so far";
  })();

  // ---- optional full detail with receipts
  (function () {
    var exs = F.examples || [];
    if (!exs.length || !el("detail")) return;
    var tabs = el("example-tabs"), tb = el("receipt-rows");
    function show(i) {
      var ex = exs[i], tot = 0;
      tb.innerHTML = "";
      var sm = el("example-summary");
      sm.innerHTML = (ex.summary || "").split("\n").map(function (t) { return "<p>" + t + "</p>"; }).join("");
      sm.hidden = !ex.summary;
      var fn = el("example-footnote");
      fn.textContent = ex.footnote || "";
      fn.hidden = !ex.footnote;
      ex.items.forEach(function (it) {
        if (it.hidden) return;
        tot += it.amount;
        var tr = document.createElement("tr");
        tr.innerHTML = '<td>' + it.date + '</td><td>' + it.vendor + '</td>' +
          '<td><span class="chip"><i style="background:' + COLORS[it.category] + '"></i>' + it.category + '</span></td>' +
          '<td class="num">' + money2(it.amount) + '</td>';
        tb.appendChild(tr);
      });
      el("example-total").textContent = money2(tot);
      Array.prototype.forEach.call(tabs.children, function (b, j) { b.setAttribute("aria-pressed", j === i ? "true" : "false"); });
    }
    exs.forEach(function (ex, i) {
      var b = document.createElement("button");
      b.type = "button"; b.textContent = ex.label;
      b.addEventListener("click", function () { show(i); });
      tabs.appendChild(b);
    });
    if (exs.length < 2) tabs.hidden = true;
    show(0);
  })();
})();
