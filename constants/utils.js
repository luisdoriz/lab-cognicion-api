const features = {
  anger: {
    average: 33.6387,
    dev: 9.8626,
    weights: [
      0.00142824, 0.00005922, -4.47620855, -2.16373442, 0.23588583, 37.46984216,
    ],
  },
  sensation: {
    average: 71.3823,
    dev: 14.9586,
    weights: [
      0.00970492, 0.00121218, -2.90708073, 0.54886367, -0.57721933, 72.44405135,
    ],
  },
  emotional: {
    average: 60.4118,
    dev: 15.8384,
    weights: [
      -0.00002479, -0.00050846, -8.49174107, -4.43767491, -0.0184151,
      67.53824207,
    ],
  },
  sociability: {
    average: 65.4412,
    dev: 16.4854,
    weights: [
      0.00369191, -0.00136071, 0.90040811, 2.26404486, 1.02968978, 62.52954642,
    ],
  },
  motivation: {
    average: 50.3529,
    dev: 17.4892,
    weights: [
      -0.00293698, 0.00061018, -10.54274205, -5.66083633, -0.20580375,
      58.74841384,
    ],
  },
};

const categoriasNechapi = {
  anger: [5, 7, 8, 10, 13, 17, 18, 19, 25, 26, 31, 35],
  sensation: [1, 2, 20, 27, 28, 36, 37, 38, 40],
  emotional: [3, 4, 6, 11, 12, 24, 32, 33, 34],
  sociability: [14, 15, 16, 27],
  motivation: [21, 22, 23, 29, 30, 39],
};

const labels = ["anger", "sensation", "emotional", "sociability", "motivation"];

module.exports = { labels, features, categoriasNechapi };
