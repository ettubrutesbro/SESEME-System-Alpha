module.exports = {
  testStory: {
    id: 1, seedling: 'environment',
    description: 'The stories in this series all deal with environmental issues - from the vain ones (our sustainability rank, as determined by the Sierra Club) to the transformative and immediate (the CA drought). Find the pedestal with the leaf on it and press its button to see more stories about this topic.',
    parts: [
      {
        values: [1,3,9,20], valueType: 'lessIsTall', customLo: 24,
        color: { ui: '#339167', monument: {hex: "#339167", bri: 1}, ring: {} },
        sound: ['cheer1','cheer2'],
        title: {
          pre: {c: 'SUSTAINABILITY', size: 18},
          main: {c: ['\u201CCool School\u201D','Rankings'], size: 30, font: 'Droid Serif', weight: 400, margin: -.2},
          post: {c: '2012', size: 18, margin: .8}
        },
        maintext: 'In 2012, UC Davis was named the "coolest school" in the US by the Sierra Club. The award celebrates campus environmental responsibility in categories like energy use, waste management, food sources, and education.', //recommended 230 character maximum

        pNames: ['UC Davis', 'Stanford', 'UC Irvine', 'UC Berkeley'],
        pTexts: ['2 years ago, we drew praise for our \'well-rounded\' environmental efforts, including bicycle infrastructure and waste diversion.','Barely behind us, Stanford earned honors for its commitment to sustainable agriculture in class and cafeteria.','Then the closest-ranked UC behind Davis, Irvine was noted for its many extracurricular environmental groups and recycling efforts.',''],
        pSymbols: [{type:'img',src:'planetest'},{type:'img',src:'planetest'},{type:'img',src:'planetest'}, {type:'img',src:'planetest'}],
        pLabels: ['','','',''],
        pStatboxes: [
          {c:'1st', size: 48, font: 'Droid Serif' }, {c: '3rd', size: 48, font: 'Droid Serif' },
          {c:'9th', size: 48, font: 'Droid Serif' }, {c: '20th, lol', size: 48, font: 'Droid Serif' }
        ],
        pExtras: [
          [{type:'link', c: ''}, {type: 'vid', c: ''}, {type: 'link', c: ''}],
          [{type:'link', c: ''}, {type: 'link', c: ''}],
          [{type:'link', c: ''}, {type: 'link', c: ''}],
          [{type:'link', c: ''}, {type: 'link', c: ''}],
        ]
      }, //end part 0
      { //begin part 1
        values: [10,13,19,5], valueType: 'lessIsTall', customLo: 24,
        title: {
          pre: {c: 'WTF WE SUCK???', size: 18},
          main: {c: ['\u201CCool School\u201D','Rankings'], size: 30, font: 'Droid Serif', weight: 400, margin: -.2},
          post: {c: '2014', size: 18, margin: .8}
        },
        maintext: 'In 2014, UC Davis sucked total butt...we were 55th, behind everybody we were beating before, and UCI took our spot on the throne. That was embarassing and it\'s now in the past. This school lightweight trash so we need to be winning at whatever we can.', //recommended 230 character maximum
        color: { ui: '#ff0000', monument: {hex: "#ff0000", bri: .5}, ring: {} },
        sound: ['boo','toilet'],

        pNames: ['bla','bla','bla','bla'],
        pTexts: ['bla','bla','bla','bla'],
        pSymbols: [{type:'geo',src:'templategeo'},{type:'spr',src:'planetest'},
          {type:'spr',src:'planetest'},{type:'spr',src:'planetest'}],
        pLabels: ['','','',''],
        pStatboxes: ['','','',''],
        pExtras: ['','','',''],

      },

      {

        values: [80,29,40,15], customLo: 0,
        title: {
          pre: {c: 'DROUGHT VS. FOOD', size: 16, align: 'start'},
          main: {c: ['Water Wasteful','Foods, Ranked.'], size: 25, font: 'Droid Serif', weight: 400, margin: -.2, align: 'start'}
        },
        maintext: 'I wanna talk about something different now. You heard about this thing called the drought? Well its real bad news folks real bad.', //recommended 230 character maximum
        color: { ui: '#00f000', monument: {hex: "#22ff55", bri: 1}, ring: {} },
        sound: ['water1','toilet'],
        pNames: ['bla','bla','bla','bla'],
        pTexts: ['bla','bla','bla','bla'],
        pSymbols: [{type:'geo',src:'templategeo'},{type:'spr',src:'planetest'},
          {type:'spr',src:'planetest'},{type:'spr',src:'planetest'}],
        pLabels: ['','','',''],
        pStatboxes: ['','','',''],
        pExtras: ['','','',''],
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
          post: {c: '2012', size: 18}
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
