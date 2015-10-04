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
        pSymbols: [{type:'geo',src:'templategeo'},{type:'spr',src:'planetest'},
          {type:'spr',src:'planetest'},{type:'spr',src:'planetest'}],
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
        pSymbols: [{type:'geo',src:'templategeo'},{type:'spr',src:'planetest'},
          {type:'spr',src:'planetest'},{type:'spr',src:'planetest'}],
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
      {//part0
        values: [100,87,77,68], customLo: 50,
        title: {
          main: {c: ['Race & Gender','Wage Gap'], size: 21},
        },
        maintext: 'Society is garbage and women can\'t get paid. Guess what though, it\'s even worse if you\'re a person of color, worse still for women of color. What\'s wrong with you shits?', //recommended 230 character maximum
        color: { ui: '#ff5555', monument: {hex: "#ff5555", bri: 1}, ring: '882222' },
        sound: ['schmoney1','schmoney2'],
        pNames: [['White Men','(sux)'],'White Women','Black Mans','WoC'],
        pTexts: ['injustice and shit','white mans sux','lets go home','fuckin no time left'],
        pSymbols: [{type:'geo',src:'templategeo'},{type:'spr',src:'planetest'},
          {type:'spr',src:'planetest'},{type:'spr',src:'planetest'}],
        pLabels: ['','','',''],
        pStatboxes: [{c: ['100%','these fools'], size:[32,14], width: 200},
        {c: ['87%','such complain'],size:[32,14]},
        {c:['77%','some bullshit'], size:[32,14]},
        {c:['68%','wtf is america'], size:[32,12]}],
        pLinks: [
          [
            {type: 'site', c: '' }
          ],
          [
            {type: 'yt', c: ''}
          ],[
            {type: 'tw2', c: ''}, {type: 'tw', c: ''}
          ],[
            {type: 'data', c: ''}, {type: 'article', c: ''}
          ]
        ]
      },//part0
      {//part1
        values: [50,87,77,68], customLo: 50,
        title: {
          main: {c: ['what it should be'], size: 21},
        },
        color: { ui: '#000000', monument: {hex: "#ffffff", bri: 1}, ring: '888888' },
        sound: ['police','horhorhor'],
        pNames: ['someshit1','someshit2','someshit3','someshit4'],
        pStatboxes: [{c: ['PCT','suck it fool'], size:[32,14]},
          {c: ['Lee','go set a watchman'],size:[32,14]},
          {c:['GTFO','fuck outta here'], size:[32,14]},
          {c:['68%','wtf is america'], size:[32,12]}
        ],
        pLinks: [
          [
            {type: 'article', c: '' }
          ],
          [
            {type: 'article', c: ''}
          ],
          '',
          [
            {type: 'tw3', c: ''}
          ]
        ]
      }//part1
    ]
  },

  anomalous: {
    id: 2, seedling: 'anomalous',
    description: '',
    parts: [
      {
        values: [4600,8000,1500,500],
        title: {
          pre: {c: 'Schmoney', size: 18},
          main: {c: ['You Are Getting','Jizzacked.com'], size: 28, font: 'Droid Serif', weight: 400, margin: -.2}
        },
        maintext: 'Mark Yudof and Linda Katehi are having a schmoney party and u are not invited, pleb',
        color: { ui: '#00ff00', monument: {hex: "#00ff00", bri: 1}, ring: '009900' },
        sound: ['horhorhor'],
        pNames: ['Mark Money','Linda Money','Yacht Money','Trust Money'],
        pTexts: ['haha go fuck yourself man!!!!!','VIP room @ the gold club','bla money all day','bla fuck you'],
        pSymbols: [{type:'spr',src:'templategeo'},{type:'spr',src:'planetest'},
          {type:'spr',src:'templategeo'},{type:'spr',src:'planetest'}],
        pLabels: ['','','',''],
        pStatboxes: [{c: 'uc davis'},{c: 'yale'},{c:'your mom'},{d:'heald college'}],
        pLinks: [[
            {type: 'article', c: ''}
          ],[
            {type: 'article', c: ''}
          ],[
            {type: 'article', c: ''}
          ],[
            {type: 'article', c: ''}
          ]
        ]
      },
      {
        values: [2000,1000,3000,4000],
        title: {
          pre: {c: 'Going innnnn', size:14 },
          main: {c: ['Spending', 'a shitload', 'of time'], size:24, font: 'Droid Serif', weight: 400},
          post: {c: 'on this project', size: 12}
        },
        color: {ui: '#f0f0f0', monument: {hex: #881166, bri: 0.8}, ring: '881166'},
        sound: ['marquardt'],
        pNames: ['Jack Leng', 'Drew Ferguson', 'Thomas Bui', 'Andrew Kwon'],
        pTexts: ['design','construction','embedded systems','network architecture'],
        pLabels: ['designer','engineer','',''],
        pStatboxes: [{c: ['fuck u', 'man']},{c:['dick','sux']}, {c: ['fucc','bois unite'],''}]
      }
    ]
  }
}
