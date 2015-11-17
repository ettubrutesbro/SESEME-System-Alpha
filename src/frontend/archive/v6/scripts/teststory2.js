
var teststory = {
  id: 1, seedling: 'environment',
  title: '',
  description: 'Some people try to rank how sustainable America\'s colleges are each year. How have we been doing?',
  parts: [
    {
      values: [1,3,9,20], valueType: 'lessIsTall', customLo: 24,
      title: {
        pre: {c: 'SUSTAINABILITY', size: 18},
        main: {c: ['\u201CCool School\u201D','Rankings'], size: 30, font: 'Droid Serif', weight: 400, margin: -.2},
        post: {c: '2012', size: 18, margin: .8}
      },
      text: 'In 2012, UC Davis was named the "coolest school" in the US by the Sierra Club. The award celebrates campus environmental responsibility in categories like energy use, waste management, food sources, and education. But a lot has changed since then...', //recommended 230 character maximum
      color: '#339167',
      scheme: 'negative',
      motion: {order: '', type: ''},
      details: [
        {name: 'UC Davis', icon: {type: 'geo', src: 'testbox'}, text: '2 years ago, we drew praise for our \'well-rounded\' environmental efforts, including bicycle infrastructure and waste diversion.', ext: [{},{},{}]},
        {name: 'Stanford', icon: {type: 'geo', src: 'testbox'}, text: 'Barely behind us, Stanford earned honors for its commitment to sustainable agriculture in class and cafeteria.', ext: [{},{},{}]},
        {name: 'UC Irvine', icon: {type: 'geo', src: 'testbox'}, text: 'Then the closest-ranked UC behind Davis, Irvine was noted for its many extracurricular environmental groups and recycling efforts.', ext: [{},{},{}]},
        {name: 'UC Berkeley', icon: {type: 'geo', src: 'testbox'}, text: '', ext: []}
      ]
    },
  ]
}

var nostory = {
  parts: [
    {values: [1,1,1,1]}
  ]
}
