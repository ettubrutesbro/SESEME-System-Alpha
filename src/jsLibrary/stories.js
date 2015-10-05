module.exports = {
  environment: {
    id: 0, seedling: 'environment',
    description: 'The stories in this series all deal with our environment - from vain ones (our sustainability ranking) to the transformative and immediate (the CA drought, marine biodiversity).',
    parts: [
      {
        values: [1,3,9,20], valueType: 'lessIsTall', customLo: 48,
        color: { ui: '#339167', monument: {hex: "#339188", bri: 1}, ring: '14BB35' },
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
        values: [55,6,1,33], valueType: 'lessIsTall',
        title: {
          pre: {c: 'GREEN CAMPUSES', size: 18},
          main: {c: ['Sierra Club','Rankings'], size: 30, font: 'Droid Serif', weight: 400, margin: -.2},
          post: {c: '2014', size: 18, margin: .5}
        },
        maintext: 'By 2014, our rank had plummeted to a lowly 55th. Nearly the worst UC in that year\'s report, we were behind all manner of schools - old, new, far, near, expensive, and cheap.',
        color: { ui: '#777035', monument: {hex: "#dbd109", bri: .65}, ring: 'dbd109' },
        sound: ['boo','toilet'],

        pNames: ['UC Davis', 'Stanford', 'UC Irvine', 'UC Berkeley'],
        pTexts: [
          '2 years later, we were behind every UC but LA, outscored even by Chico State (not even ranked in 2012). Poor marks in energy use and new construction seem to have hurt particularly.',
        'In 6th place, Stanford scored prominently in purchasing, transportation, and water conservation. It  even divested from the coal industry to the tune of $18bn.',
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
        values: [311,1450,167,890], customLo: 500,
        title: {
          main: {c: 'Annual Energy Costs', size: 25, font: 'Droid Serif', weight: 400},
          pre: {c: '@ UC DAVIS', size: 21}
        },
        maintext: 'The energy expenditures data shown here was sourced from the Energy Feedback Team (eco.ucdavis.edu)\'s awesome tool, CEED (ceed.ucdavis.edu).',
        color: { ui: '3a3a3a', monument: {hex: "#ffffff", bri: 0.5}, ring: '284444' },
        sound: ['schmoney1','schmoney2'],
        pNames: ['The ARC','Meyer Hall','Giedt Hall',['Student Community','Center']],
        pTexts: [
          'Long hours of operation in a large space haven\'t impacted the ARC\'s efficiency too adversely - it\'s only a little more expensive than the average \'community\' building.',
          'Constructed in 1987, this hall houses a great many departments, but its energy footprint is scarcely excusable; even accounting for size, its energy use intensity is nearly double the average lab.',
          'Comfy but a little energy-expensive, Giedt\'s energy use intensity of 75 is notably above the classroom average - perhaps surprising considering it was built in 2007.',
          ''
        ],
        pSymbols: ['','','',''],
        pLabels: ['','','',''],
        pStatboxes: [{c:'$311,000'},{c:'$1.45 million'},{c:'$16,700'},{c:'$89,000'}],
        pLinks: [
          {type: 'site', c: 'daviswiki'},
          {type: 'site', c: 'daviswiki'},
          {type: 'site', c: 'daviswiki'},
          ''
        ]
      }
    ]
  },

  society: {
    id: 1, seedling: 'society',
    description: 'The stories and data in this series deal with issues of social justice and inequity on a large scale.',
    parts: [
        {
          values: [1300,950,1325,1050], customLo: 700,
          color: { ui: '#628976', monument: {hex: "#628976", bri: 1}, ring: '337946' },
          sound: ['schmoney1','schmoney2'],
          title: {
            pre: {c: 'WAGE GAPS', size: 18},
            main: {c: ['Men\'s Weekly','Median Earnings'], size: 24, font: 'Droid Serif', weight: 400, margin: -.2},
            post: {c: '(Bachelor\'s, Full-Time)', size: 14}
          },
          maintext: 'In 2013, women in the US earned 82 cents to every dollar a man made. Stats from the Bureau of Labor Statistics show that income is staggered by both race and gender. Shown is a comparison of median weekly earnings between bachelor\'s degree holders.',

          pNames: ['White Men','Black Men','Asian Men','Hispanic Men'],
          pTexts: ['','','',''],
          pSymbols: ['','','',''],
          pLabels: ['','','',''],
          pStatboxes: [
            {c:['$1300','weekly'], size: [24,14], font: ['Droid Serif','Karla']},
            {c:['$950','weekly'], size: [24,14], font: ['Droid Serif','Karla']},
            {c:['$1325','weekly'], size: [24,14], font: ['Droid Serif','Karla']},
            {c:['$1050','weekly'], size: [24,14], font: ['Droid Serif','Karla']}],
          pLinks: ['','','','']
        }, //end part 0
        {
          values: [950,870,1040,815], customHi: 1325, customLo: 700,
          title: {
            pre: {c: 'WAGE GAPS', size: 18},
            main: {c: ['Women\'s Weekly','Median Earnings'], size: 24, font: 'Droid Serif', weight: 400, margin: -.2},
            post: {c: '(Bachelor\'s, Full-Time)', size: 14}
          },
          maintext: 'The same dataset reveals that women make less than men of the same race at every level of education. This gives the lie to the myth of education-as-equalizer; while lack of education results in poverty for any race or gender, men - especially whites - benefit disproportionately from it.', //recommended 230 character maximum
          color: { ui: '#626b66', monument: {hex: "#628976", bri: 0.5}, ring: '152821' },
          sound: ['schmoney1','schmoney2'],

          pNames: ['White Women','Black Women','Asian Women','Hispanic Women'],
          pTexts: [
            '',
            'Examining the data, Deborah Ashton of Harvard Business Review notes that black and Hispanic women "vie for last place on the earnings pyramid at every level of education".',
            'The gap between Asian women/men is the largest; Asian women earn 78 cents to every dollar their male counterparts earn (81% for whites).',
            'Examining the data, Deborah Ashton of Harvard Business Review notes that black and Hispanic women "vie for last place on the earnings pyramid at every level of education".'],
          pSymbols: ['','','',''],
          pLabels: ['','','',''],
          pStatboxes: [
            {c:['$950','weekly'], size: [24,14], font: ['Droid Serif','Karla']},
            {c:['$870','weekly'], size: [24,14], font: ['Droid Serif','Karla']},
            {c:['$1040','weekly'], size: [24,14], font: ['Droid Serif','Karla']},
            {c:['$815','weekly'], size: [24,14], font: ['Droid Serif','Karla']}],
          pLinks: ['','','','']
        },
        {
          values: [2217,1657,644,607], customLo: 300,
          title: {
            pre: {c: 'MASS INCARCERATION', size: 14},
            main: {c: ['World Prison','Population'], size: 25, font: 'Droid Serif', weight: 400, margin: -.2}
          },
          maintext: 'As the ACLU puts it: "America, "land of the free", has earned the disturbing distinction of being the world’s leading jailer". Though it contains just 5 percent of the world’s population, the US holds 25 percent of its prisoners.', //recommended 230 character maximum
          color: { ui: '#db6719', monument: {hex: "#db6719", bri: 1}, ring: 'ff6619' },
          sound: ['jail'],
          pNames: ['United States','China','Russia','Brazil'],
          pTexts: [
            'Lengthy minimum sentences, three strikes laws, and other draconian policies have fed a thriving prison-industrial complex, choked federal and state budgets, and inflated the national prison population over 700% in the last 40 years.',
            'China, itself no stranger to human rights controversy and worldwide condemnation, has a population more than 4 times greater than the US\'s but 75% less prisoners.',
            '',
            ''
          ],
          pSymbols: ['','','',''],
          pLabels: ['','','',''],
          pStatboxes: [
            {c: '2,200,000'},
            {c: '1,658,000'},
            {c: '645,000'},
            {c: '608,000'}
          ],
          pLinks: [
            [{type: 'site', c: 'aclumassinca'},{type:'yt',c:'viceshit'}],
            [{type: 'data', c: '#list'}],
            '','']
        },
        {
          values: [41,15.3,52,20], customLo: 12,
          title: {
            pre: {c: 'MASS INCARCERATION', size: 14},
            main: {c: ['State Spending','per Inmate'], size: 24, font: 'Droid Serif', weight: 400, margin: -.2}
          },
          maintext: 'Mass incarceration accounts for the 2nd fastest growing type of state government spending, having grown 127% since 1987 (higher education spending increased 21% in the same period). The U.S. spends over $80 billion on prisons and related expenses every year.',
          color: { ui: '#ad360c', monument: {hex: "#ad360c", bri: 1}, ring: 'ff2200' },
          sound: ['jail'],
          pNames: ['California','Louisiana','New York','Texas'],
          pTexts: ['','','',''],
          pSymbols: ['','','',''],
          pLabels: ['','','',''],
          pStatboxes: [
            {c: '$41,000'},
            {c: '$15,000'},
            {c: '$52,000'},
            {c: '$20,000'}
          ],
          pLinks: ['','','','']
        },
        {
          values: [8.2,9.3,12.6,7.6], customLo: 5.3,
          title: {
            pre: {c: 'MASS INCARCERATION', size: 14},
            main: {c: ['State Spending','per Student'], size: 24, font: 'Droid Serif', weight: 400, margin: -.2}
          },
          maintext: 'Meanwhile, data from the U.S. Census and the Vera Institute of Justice shows that states spend far less money on K-12 students - nearly 5 times less, in California\'s case.',
          color: { ui: '#ad360c', monument: {hex: "#ad360c", bri: 1}, ring: 'ff2200' },
          sound: ['jail'],
          pNames: ['California','Louisiana','New York','Texas'],
          pTexts: ['','','',''],
          pSymbols: ['','','',''],
          pLabels: ['','','',''],
          pStatboxes: [
            {c: '$8,200'},
            {c: '$9,300'},
            {c: '$12,600'},
            {c: '$7,600'}
          ],
          pLinks: ['','','','']
        },
        {
          values: [.33,.05,.16,0.1], customLo: 0,
          title: {
            pre: {c: 'MASS INCARCERATION', size: 14},
            main: {c: ['Lifetime Chance','of Imprisonment'], size: 21, font: 'Droid Serif', weight: 400, margin: -.2}
          },
          maintext: 'The US imprisons a larger percentage of its black population than South Africa ever did during apartheid. Data from the Bureau of Justice Statistics shows that over 60% of American inmates are racial or ethnic minorities.',
          color: { ui: '#7c0701', monument: {hex: "#7c0701", bri: 0.75}, ring: 'ff0000' },
          sound: ['jail'],
          pNames: ['Black Men','White Men','Latino Men','All Men'],
          pTexts: ['Black men are 20 to 50 times more likely to be imprisoned on drug charges than white men, but there is no significant difference in drug crime or use between races.',
          '','',''],
          pSymbols: ['','','',''],
          pLabels: ['','','',''],
          pStatboxes: [
            {c: '1 in 3'},
            {c: '1 in 17'},
            {c: '1 in 6'},
            {c: '1 in 9'}
          ],
          pLinks: [
            [{type: 'book',c:'michellealexander'},{type:'data',c:'sentencingproject'}],
            '','','']
        },
      ]
  },

  anomalous: {
    id: 2, seedling: 'anomalous',
    description: 'These stories can be about anything.',
    parts: [
      {
        values: [0,5,88,22], valueType: 'lessIsTall', customLo: 0,
        color: { ui: '#339167', monument: {hex: "#339167", bri: 1}, ring: '24BB48' },
        sound: ['cheer1','cheer2'],
        title: {
          pre: {c: ['SEXUAL HEALTH','REPORT CARD'], size: 24}
        },
        maintext: 'Every year, Trojan and BestPlaces study and rank colleges nationwide to produce a \'Sexual Health Report Card\'. The rankings are based on campuses\' student health centers and the quality / availability of the services they provide.',

        pNames: ['UC Davis', 'Stanford', 'UCLA', 'UC Berkeley'],
        pTexts: [
          'Trojan and BestPlaces\' selection of 140 schools to rank is (stupidly) tied to prominent athletic conferences / college football, so UC Davis isn\'t featured.',
          '',
          '',
          ''
        ],
        pSymbols: ['','','',''],
        pLabels: ['','','',''],
        pStatboxes: [
          {c:'N/A'}, {c: '5th' },
          {c:'88th'}, {c: '22nd' }
        ],
        pLinks: [
          {type: 'list', c:'bestplaces'},
          '','',''
        ]
      }, //end part 0
      {
        values: [15,15.7,12,13.7], customLo: 10,
        color: { ui: '#339167', monument: {hex: "#339167", bri: 1}, ring: '24BB48' },
        sound: ['cheer1','cheer2'],
        title: {
          pre: {c: 'The Cost of Education', size: 12},
          main: {c: 'Average Annual Cost', size: 24, font: 'Droid Serif'}
        },
        maintext: 'Here are some college tuitions. Y\'all getting jacked.',

        pNames: ['UC Davis', 'Stanford', 'UC Irvine', 'UC Berkeley'],
        pTexts: ['','','',''],
        pSymbols: ['','','',''],
        pLabels: ['','','',''],
        pStatboxes: [
          {c:'$15k'}, {c: '$15.7k'}, {c:'$12k'}, {c: '$13.7k' }
        ],
        pLinks: ['','','','']
      }, //end part 0
      {
        values: [15,15.7,12,13.7], customLo: 10,
        color: { ui: '#000000', monument: {hex: "#339167", bri: 0.25}, ring: '050510' },
        sound: ['cheer1','cheer2'],
        title: {
          pre: {c: 'The Cost of Education', size: 12},
          main: {c: ['Salary After','Attending'], size: 24, font: 'Droid Serif'}
        },
        maintext: 'Here\'s what the average student at these universities makes after attending.',

        pNames: ['UC Davis', 'Stanford', 'UC Irvine', 'UC Berkeley'],
        pTexts: ['','','',''],
        pSymbols: ['','','',''],
        pLabels: ['','','',''],
        pStatboxes: [
          {c:'$57k / year'}, {c: '$80.9k / year'}, {c:'$55.8k / year'}, {c: '$62k / year' }
        ],
        pLinks: ['','','','']
      }, //end part 0

    ]
  }
}
