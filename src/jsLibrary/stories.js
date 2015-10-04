module.exports = {
  environment: {
    id: 0, seedling: 'environment',
    description: 'The stories in this series all deal with our environment - from vain ones (our sustainability ranking) to the transformative and immediate (the CA drought, marine biodiversity).',
    parts: [
      {
        values: [1,3,9,20], valueType: 'lessIsTall', customLo: 24,
        color: { ui: '#339167', monument: {hex: "#339167", bri: 1}, ring: '24BB48' },
        sound: ['cheer1','cheer2'],
        title: {
          pre: {c: 'STORY 0 (env)', size: 18},
          main: {c: 'Part 0(1)', size: 30, font: 'Droid Serif', weight: 400, margin: -.2}
        },
        maintext: 'In 2012, UC Davis was named the "coolest school" in the US by the Sierra Club. The award celebrates campus environmental responsibility in categories like energy use, waste management, food sources, and education.', //recommended 230 character maximum

        pNames: ['UC Davis', 'Stanford', 'UC Irvine', 'UC Berkeley'],
        pTexts: ['2 years ago, we drew praise for our \'well-rounded\' environmental efforts, including bicycle infrastructure and waste diversion.','Barely behind us, Stanford earned honors for its commitment to sustainable agriculture in class and cafeteria.','Then the closest-ranked UC behind Davis, Irvine was noted for its many extracurricular environmental groups and recycling efforts.',''],
        pSymbols: [{type:'img',src:'planetest'},{type:'img',src:'planetest'},{type:'img',src:'planetest'}, {type:'img',src:'planetest'}],
        pLabels: ['','','',''],
        pStatboxes: [
          {c:['1st Place', 'so fuck off'], size: [18,12] }, {c: '3rd', size: 18 },
          {c:'9th', size: 18 }, {c: '20th, lol', size: 18 }
        ],
        pLinks: [
          [{type:'yt', c: 'youtube.com'}, {type: 'article', c: 'bomb.com'}, {type: 'list', c: 'sierraclublist.com'}],
          [{type:'article', c: 'fuckyou.com'}, {type: 'list', c: ''}],
          [{type:'article', c: ''}, {type: 'list', c: 'gohome.org'}],
          [{type: 'list', c: ''}],
        ]
      }, //end part 0
      {
        values: [10,13,19,5], valueType: 'lessIsTall', customLo: 24,
        title: {
          pre: {c: 'STORY 0(env)', size: 18},
          main: {c: 'Part 1(2)', size: 30, font: 'Droid Serif', weight: 400, margin: -.2}
        },
        maintext: 'In 2014, UC Davis sucked total butt...we were 55th, behind everybody we were beating before, and UCI took our spot on the throne. That was embarassing and it\'s now in the past. This school lightweight trash so we need to be winning at whatever we can.', //recommended 230 character maximum
        color: { ui: '#ff0000', monument: {hex: "#ff0000", bri: .5}, ring: '991100' },
        sound: ['boo','toilet'],

        pNames: [['shaddup','fool'],'bla','bla','bla'],
        pTexts: ['bla','bla','bla','bla'],
        pSymbols: [{type:'geo',src:'templategeo'},{type:'img',src:'planetest'},
          {type:'img',src:'planetest'},{type:'img',src:'planetest'}],
        pLabels: ['','','',''],
        pStatboxes: ['','','',''],
        pLinks: ['','','','']

      },

      {

        values: [80,29,40,15], customLo: 0,
        title: {
          pre: {c: 'STORY 0(env)', size: 16, align: 'start'},
          main: {c: 'Part 2(3)', size: 25, font: 'Droid Serif', weight: 400, margin: -.2, align: 'start'}
        },
        maintext: 'I wanna talk about something different now. You heard about this thing called the drought? Well its real bad news folks real bad.', //recommended 230 character maximum
        color: { ui: '#00f000', monument: {hex: "#22ff55", bri: 1}, ring: '00f000' },
        sound: ['water1','toilet'],
        pNames: ['bla','bla','bla','bla'],
        pTexts: ['bla','bla','bla','bla'],
        pSymbols: [{type:'geo',src:'templategeo'},{type:'img',src:'planetest'},
          {type:'img',src:'planetest'},{type:'img',src:'planetest'}],
        pLabels: ['','','',''],
        pStatboxes: ['','','',''],
        pLinks: ['','','','']
      }
    ]
  },

  society: {
    id: 1, seedling: 'society',
    description: '',
    parts: [
        {
          values: [9,10,2,4],
          color: { ui: '#339167', monument: {hex: "#339167", bri: 1}, ring: '24BB48' },
          sound: ['horhorhor'],
          title: {
            pre: {c: 'STORY 2(soc)', size: 18},
            main: {c: 'Part 0(1)', size: 30, font: 'Droid Serif', weight: 400, margin: -.2}
          },
          maintext: 'This story will eventually be about the gender / race wage gap',

          pNames: ['','','',''],
          pTexts: ['','','',''],
          pSymbols: ['','','',''],
          pLabels: ['','','',''],
          pStatboxes: ['','','',''],
          pLinks: ['','','','']
        }, //end part 0
        {
          values: [1,2,3,4],
          title: {
            pre: {c: 'STORY 1(soc)', size: 18},
            main: {c: 'Part 1(2)', size: 30, font: 'Droid Serif', weight: 400, margin: -.2}
          },
          maintext: '', //recommended 230 character maximum
          color: { ui: '#ff0000', monument: {hex: "#ff0000", bri: .5}, ring: '991100' },
          sound: ['schmoney2'],

          pNames: ['','','',''],
          pTexts: ['less','is','a','bore'],
          pSymbols: ['','','',''],
          pLabels: ['','','',''],
          pStatboxes: ['','','',''],
          pLinks: ['','','','']

        },

        {

          values: [80,29,40,15], customLo: 0,
          title: {
            pre: {c: 'STORY 1(soc)', size: 16},
            main: {c: 'Part 2(3)', size: 25, font: 'Droid Serif', weight: 400, margin: -.2}
          },
          maintext: 'I wanna talk about something tnoehutnaoehutnaoehtneuh ', //recommended 230 character maximum
          color: { ui: '#00f000', monument: {hex: "#22ff55", bri: 1}, ring: '00f000' },
          sound: ['marquardt'],
          pNames: ['bla','bla','bla','bla'],
          pTexts: ['bla','bla','bla','bla'],
          pSymbols: [{type:'geo',src:'templategeo'},{type:'img',src:'planetest'},
            {type:'img',src:'planetest'},{type:'img',src:'planetest'}],
          pLabels: ['','','',''],
          pStatboxes: ['','','',''],
          pLinks: ['','','','']
        }
      ]
  },

  anomalous: {
    id: 2, seedling: 'anomalous',
    description: '',
    parts: [
      {
        values: [1,3,9,20], valueType: 'lessIsTall', customLo: 24,
        color: { ui: '#339167', monument: {hex: "#339167", bri: 1}, ring: '24BB48' },
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
          {c:['1st Place', 'so fuck off'], size: [18,12] }, {c: '3rd', size: 18 },
          {c:'9th', size: 18 }, {c: '20th, lol', size: 18 }
        ],
        pLinks: [
          [{type:'yt', c: 'youtube.com'}, {type: 'article', c: 'bomb.com'}, {type: 'list', c: 'sierraclublist.com'}],
          [{type:'article', c: 'fuckyou.com'}, {type: 'list', c: ''}],
          [{type:'article', c: ''}, {type: 'list', c: 'gohome.org'}],
          [{type: 'list', c: ''}],
        ]
      }, //end part 0
      {
        values: [10,13,19,5], valueType: 'lessIsTall', customLo: 24,
        title: {
          pre: {c: 'WTF WE SUCK???', size: 18},
          main: {c: ['\u201CCool School\u201D','Rankings'], size: 30, font: 'Droid Serif', weight: 400, margin: -.2},
          post: {c: '2014', size: 18, margin: .8}
        },
        maintext: 'In 2014, UC Davis sucked total butt...we were 55th, behind everybody we were beating before, and UCI took our spot on the throne. That was embarassing and it\'s now in the past. This school lightweight trash so we need to be winning at whatever we can.', //recommended 230 character maximum
        color: { ui: '#ff0000', monument: {hex: "#ff0000", bri: .5}, ring: '991100' },
        sound: ['boo','toilet'],

        pNames: [['shaddup','fool'],'bla','bla','bla'],
        pTexts: ['bla','bla','bla','bla'],
        pSymbols: [{type:'geo',src:'templategeo'},{type:'img',src:'planetest'},
          {type:'img',src:'planetest'},{type:'img',src:'planetest'}],
        pLabels: ['','','',''],
        pStatboxes: ['','','',''],
        pLinks: ['','','','']

      },

      {

        values: [80,29,40,15], customLo: 0,
        title: {
          pre: {c: 'DROUGHT VS. FOOD', size: 16, align: 'start'},
          main: {c: ['Water Wasteful','Foods, Ranked.'], size: 25, font: 'Droid Serif', weight: 400, margin: -.2, align: 'start'}
        },
        maintext: 'I wanna talk about something different now. You heard about this thing called the drought? Well its real bad news folks real bad.', //recommended 230 character maximum
        color: { ui: '#00f000', monument: {hex: "#22ff55", bri: 1}, ring: '00f000' },
        sound: ['water1','toilet'],
        pNames: ['bla','bla','bla','bla'],
        pTexts: ['bla','bla','bla','bla'],
        pSymbols: [{type:'geo',src:'templategeo'},{type:'img',src:'planetest'},
          {type:'img',src:'planetest'},{type:'img',src:'planetest'}],
        pLabels: ['','','',''],
        pStatboxes: ['','','',''],
        pLinks: ['','','','']
      }
    ]
  }
}
