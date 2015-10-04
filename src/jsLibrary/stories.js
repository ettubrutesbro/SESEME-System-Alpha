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
          pre: {c: 'GREEN CAMPUSES', size: 18},
          main: {c: ['Sierra Club','Rankings'], size: 30, font: 'Droid Serif', weight: 400, margin: -.2},
          post: {c: '2012', size: 18, margin: .5}
        },
        maintext: 'In 2012, UC Davis was named the "coolest school" in the US by the Sierra Club. The award celebrates campus environmental responsibility in categories like energy use, waste management, food sources, and education.',
        pNames: ['UC Davis', 'Stanford', 'UC Irvine', 'UC Berkeley'],
        pTexts: ['2 years ago, we drew praise for our \'well-rounded\' environmental efforts, including bicycle infrastructure and waste diversion.',
        'Barely behind us in 3rd place, Stanford earned honors for its commitment to 	sustainable agriculture in class and cafeteria.',
        'Then the closest-ranked UC behind Davis, Irvine was noted for its many 	extracurricular environmental groups and recycling efforts.',
        'The Sierra Club doesn\'t write anything about schools outside the top 10, but Davis thoroughly trounced Berkeley (20th) in the sustainability department in 2012.'],
        pSymbols: ['','','',''],
        pLabels: ['','','',''],
        pStatboxes: [
          {c:'1st Place', size: 18 }, {c: '3rd', size: 18 },
          {c:'9th', size: 18 }, {c: '20th, lol', size: 18 }
        ],
        pLinks: [
          [{type:'yt', c: 'sierraclubvideo'}, {type: 'article', c: 'sierraclubslideshow'}, {type: 'article', c: 'ucdpress'}],
          [{type:'article', c: 'sierraclubslideshow'}, {type: 'list', c: 'sierraclublist'}],
          [{type:'article', c: 'sierraclubslideshow'}, {type: 'list', c: 'sierraclublist'}],
          [{type: 'list', c: 'sierraclublist'}],
        ]
      }, //end part 0
      {
        values: [10,13,19,5], valueType: 'lessIsTall', customLo: 24,
        title: {
          pre: {c: 'GREEN CAMPUSES', size: 18},
          main: {c: ['Sierra Club','Rankings'], size: 30, font: 'Droid Serif', weight: 400, margin: -.2},
          post: {c: '2014', size: 18, margin: .5}
        },
        maintext: 'By 2014, our rank had plummeted to a lowly 55th. Nearly the worst UC in that year\'s report, we were behind all manner of schools - old, new, far, near, expensive, and cheap.',
        color: { ui: '#ff0000', monument: {hex: "#ff0000", bri: .5}, ring: '991100' },
        sound: ['boo','toilet'],

        pNames: ['UC Davis', 'Stanford', 'UC Irvine', 'UC Berkeley'],
        pTexts: ['2 years later, we were behind every UC but LA, outscored even by Chico State (not even ranked in 2012). Poor marks in energy use and new construction seem to have 	hurt particularly.',
        'In 6th place, Stanford scored prominently in purchasing, transportation, and water 	conservation. Its financial clout let it focus on minimally packaged, recyclable, and green-certified products and divest $18bn from the coal industry.',
        'The new 1st place school, Irvine supplanted us and wowed the Sierra Club with its extensive solar power and water-recycling programs.',
        'Still outside of the top 10, but now a full 22 spots ahead of us, UC Berkeley scored far ahead of us on co-curricular activities, investments, and planning.'],
        pSymbols: ['','','',''],
        pLabels: ['','','',''],
        pStatboxes: [{c: '55th :(', size: 18},{c:'6th',size:18},{c:'1st',size:18},{c:'33rd',size:18}],
        pLinks: [
          [{type: 'list',c:'2014list'}],
          [{type: 'article',c:'sierraclubslideshow'}],
          [{type: 'article',c:'sierraclubslideshow'},{type:'article',c:'ucipressrelease'},{type:'yt',c:'video?'}],
          [{type: 'list', c: '2014list'}]
        ]
      },

      {
        values: [80,29,40,15], customLo: 0,
        title: {
          main: {c: 'Annual Energy Costs', size: 25, font: 'Droid Serif', weight: 400},
          pre: {c: '@ UC DAVIS', size: 21}
        },
        maintext: 'The energy expenditures data shown here was sourced from the Energy Feedback Team (eco.ucdavis.edu)\'s awesome tool, CEED (ceed.ucdavis.edu).',
        color: { ui: '#00f000', monument: {hex: "#22ff55", bri: 1}, ring: '00f000' },
        sound: ['schmoney1','schmoney2'],
        pNames: ['The ARC','Meyer Hall','Giedt Hall',['Student Community','Center']],
        pTexts: [
          'Long ',
          'Constructed in 1987, this hall houses a great many departments, but its energy footprint is scarcely excusable; even accounting for size, its energy use intensity is nearly double the average lab.',
          'Comfy but a little energy-expensive, Giedt\'s energy use intensity of 75 is notably above the classroom average - perhaps surprising considering it was built in 2007.',
          ''
        ],
        pSymbols: ['','','',''],
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
            pre: {c: 'STORY 1(soc)', size: 18},
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
