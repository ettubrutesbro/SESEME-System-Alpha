module.exports = {
  testStory: {
    id: 1, seedling: 'environment',
    description: 'The stories in this series all deal with environmental issues - from the vain ones (our sustainability rank, as determined by the Sierra Club) to the transformative and immediate (the CA drought). Find the pedestal with the leaf on it and press its button to see more stories about this topic.',
    parts: [
      {
        sound: ['cheer1','cheer2'],
        values: [1,3,9,20], valueType: 'lessIsTall', customLo: 24,
        title: {
          pre: {c: 'SUSTAINABILITY', size: 18},
          main: {c: ['\u201CCool School\u201D','Rankings'], size: 30, font: 'Droid Serif', weight: 400, margin: -.2},
          post: {c: '2012', size: 18, margin: .8}
        },
        text: 'In 2012, UC Davis was named the "coolest school" in the US by the Sierra Club. The award celebrates campus environmental responsibility in categories like energy use, waste management, food sources, and education. But a lot has changed since then...', //recommended 230 character maximum
        color: '#339167',
        details: [
          {name: 'UC Davis', text: '2 years ago, we drew praise for our \'well-rounded\' environmental efforts, including bicycle infrastructure and waste diversion.'},
          {name: 'Stanford', text: 'Barely behind us, Stanford earned honors for its commitment to sustainable agriculture in class and cafeteria.'},
          {name: 'UC Irvine', text: 'Then the closest-ranked UC behind Davis, Irvine was noted for its many extracurricular environmental groups and recycling efforts.'},
          {name: 'UC Berkeley', text: '',}
        ]
      },

      {
        sound: ['boo','toilet'],
        values: [10,13,19,5], valueType: 'lessIsTall', customLo: 24,
        title: {
          pre: {c: 'WTF WE SUCK???', size: 18},
          main: {c: ['\u201CCool School\u201D','Rankings'], size: 30, font: 'Droid Serif', weight: 400, margin: -.2},
          post: {c: '2014', size: 18, margin: .8}
        },
        text: 'In 2014, UC Davis sucked total butt...we were 55th, behind everybody we were beating before, and UCI took our spot on the throne. That was embarassing and it\'s now in the past. This school lightweight trash so we need to be winning at whatever we can.', //recommended 230 character maximum
        color: '#ff0000',
        details: [
          {name: 'UC Davis', text: 'Since then we crashed hard. That was pretty inexcusable because nobodies such as Chico State were bodying us in the paint.'},
          {name: 'testo2', text: 'Fuck outta here this is short text :)'},
          {name: 'testo3', text: 'Anteaters can eat my butt'},
          {name: 'testo4', text: 'Now the bears have text!!! What a bunch of schmucks blah blah blah get rich or die trying hehehehe ',}
        ]
      },

      {
        sound: ['water1','toilet'],
        values: [80,29,40,15], customLo: 0,
        title: {
          pre: {c: 'DROUGHT VS. FOOD', size: 16, align: 'start'},
          main: {c: ['Water Wasteful','Foods, Ranked.'], size: 25, font: 'Droid Serif', weight: 400, margin: -.2, align: 'start'},
          post: {c: '(protip: don\'t eat meat)', size: 16, align: 'start', margin: -.5}
        },
        text: 'I wanna talk about something different now. You heard about this thing called the drought? Well its real bad news folks real bad.', //recommended 230 character maximum
        color: '#00ff00',
        details: [
          {name: 'Beef', text: 'K i love hamburgers too but they are BODYING our water supply, this is seriously like tho most inefficient ass use of water ever'},
          {name: 'ALMONDS', text: ''},
          {name: 'Alfalfa', text: 'I actualyl like this stuff but its pretty water intense and unfortunately thats not gonna be ok in this climate'},
          {name: 'Global Warming', text: '???',}
        ]
      }
    ]
  },

  finalStory: {
    id: 1, seedling: 'environment',
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
        details: [
          {name: 'UC Davis', text: '2 years ago, we drew praise for our \'well-rounded\' environmental efforts, including bicycle infrastructure and waste diversion.'},
          {name: 'Stanford', text: 'Barely behind us, Stanford earned honors for its commitment to sustainable agriculture in class and cafeteria.'},
          {name: 'UC Irvine', text: 'Then the closest-ranked UC behind Davis, Irvine was noted for its many extracurricular environmental groups and recycling efforts.'},
          {name: 'UC Berkeley', text: '',}
        ]
      },
    ]
  },
}
