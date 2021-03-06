var stories = [
  {
    id: 0, seedling: 'environment',
    description: 'This series of stories and data discusses sustainability and our impact as a society on the natural environment.',
    parts: [
      {
        values: [1,3,9,20], valueType: 'lessIsTall', customLo: 48,
        color: { ui: '#339167', monument: {hex: "#339188", bri: 1}, ring: '14BB35' },
        sound: ['cheer1','cheer2'],
        title: {
          pre: {c: '\"COOL\" SCHOOLS', size: 18},
          main: {c: ['Sierra Club','Rankings'], size: 30, font: 'Droid Serif', weight: 400, margin: -.2},
          post: {c: '2012', size: 18, margin: .5}
        },
        maintext: 'In 2012, UC Davis was named the "coolest school" in the US by the Sierra Club. The award celebrates campus environmental responsibility in categories like energy use, waste management, food sources, and education.',
        pNames: ['UC Davis', 'Stanford', 'UC Irvine', 'UC Berkeley'],
        pTexts: ['2 years ago, we drew praise for our \'well-rounded\' environmental efforts, including bicycle infrastructure and waste diversion.',
        'Barely behind us in 3rd place, Stanford earned honors for its commitment to sustainable agriculture in class and cafeteria.',
        'Then the closest-ranked UC behind Davis, Irvine was noted for its many extracurricular environmental groups and recycling efforts.',
        'A distant 20th place in 2012, The Sierra Club didn\'t have special anything to say about Cal.'],
        pSymbols: ['','','',''],
        pZoomLabels: ['','','',''],
        pStatboxes: [
          {c:'1st Place', size: 18 }, {c: '3rd', size: 18 },
          {c:'9th', size: 18 }, {c: '20th, lol', size: 18 },
        ],
        pLinks: [
          [{type:'yt', c: 'https://youtu.be/s_aYTip3jK0'}, {type: 'article', c: 'http://vault.sierraclub.org/sierra/201209/coolschools/slideshow/top-ten-cool-schools-uc-davis-1.aspx'}, {type: 'www', c: 'http://ucdavis.edu/ucdavis-today/2012/august/14-cool-school.html'}],
          [{type:'article', c: 'http://vault.sierraclub.org/sierra/201209/coolschools/slideshow/top-ten-cool-schools-stanford-university-3.aspx'}, {type: 'list', c: 'http://vault.sierraclub.org/sierra/201209/coolschools/complete-rankings-cool-schools.aspx'}],
          [{type:'article', c: 'http://vault.sierraclub.org/sierra/201209/coolschools/slideshow/top-ten-cool-schools-uc-irvine-9.aspx'}, {type: 'list', c: 'http://vault.sierraclub.org/sierra/201209/coolschools/complete-rankings-cool-schools.aspx'}],
          [{type: 'list', c: 'sierraclublist'}],
        ]
      }, //end part 0
      {
        values: [55,6,1,33], valueType: 'lessIsTall', customLo: 65,
        title: {
          pre: {c: 'TWO YEARS LATER', size: 18},
          main: {c: ['Sierra Club','Rankings'], size: 30, font: 'Droid Serif', weight: 400, margin: -.2},
          post: {c: '2014', size: 18, margin: .5}
        },
        maintext: 'By 2014, our rank had plummeted to a lowly 55th. Nearly the worst UC in that year\'s report, we were behind all manner of schools - old, new, far, near, expensive, and cheap.',
        color: { ui: '#777035', monument: {hex: "#dbd109", bri: .65}, ring: 'dbd109' },
        sound: ['boo','toilet'],

        pNames: ['UC Davis', 'Stanford', 'UC Irvine', 'UC Berkeley'],
        pTexts: [
          '2 years later, we were behind every UC but LA, outscored even by Chico State (not even ranked in \'12). Poor marks in energy use and new construction seem to have hurt our score the most.',
        'In 6th place, Stanford scored prominently in purchasing, transportation, and water conservation, even divesting $18bn from the coal industry.',
        'Supplanting our first place spot in 2014, Irvine wowed the Sierra Club with its extensive solar power and water-recycling programs.',
        'In our year of ignominy, Berkeley scored far ahead in co-curricular activities, investments, and planning.'],
        pSymbols: ['','','',''],
        pZoomLabels: ['','','',''],
        pStatboxes: [{c: '55th :(', size: 18},{c:'6th',size:18},{c:'1st',size:18},{c:'33rd',size:18}],
        pLinks: [
          [{type: 'list',c:'http://www.sierraclub.org/sierra/2014-5-september-october/cool-schools-2014/full-ranking'}],
          [{type: 'article',c:'http://www.sierraclub.org/sierra/slideshow/top-ten-coolest-schools-2014#7'}],
          [{type: 'article',c:'http://www.sierraclub.org/sierra/slideshow/top-ten-coolest-schools-2014#12'},{type:'www',c:'http://news.uci.edu/campus-life/uci-were-the-coolest/'}],
          [{type: 'list', c: 'http://www.sierraclub.org/sierra/2014-5-september-october/cool-schools-2014/full-ranking'}]
        ]
      },

      {
        values: [311,1450,16.7,89], customLo: -200,
        title: {
          pregame: {c: 'POWERING UC DAVIS', size: 16},
          main: {c: ['Annual Energy', 'Expenditures'], size: 26, font: 'Droid Serif', weight: 400, margin: -.25},
          pre: {c: '(some campus buildings)', size: 14, margin: 0.75}
        },
        maintext: 'The energy expenditures data shown here was sourced from the Energy Feedback Team (eco.ucdavis.edu)\'s awesome tool, CEED (ceed.ucdavis.edu).',
        color: { ui: '3a3a3a', monument: {hex: "#ffffff", bri: 0.5}, ring: '284444' },
        sound: ['schmoney1','schmoney2'],
        pNames: ['The ARC','Meyer Hall','Giedt Hall','The SCC'],
        pTexts: [
          'Long hours of operation and voluminous space haven\'t made an inefficient building of the ARC - it\'s only a little more expensive than the average \'community\' building.',
          'Constructed in 1987, this hall houses a great many departments, but that alone doesn\'t explain its energy footprint; even accounting for size, Meyer\'s energy use intensity is nearly double the average lab.',
          'Comfy but a little energy-expensive, Giedt\'s energy use intensity of 75 is notably above the classroom average - surprising, considering it\'s a relatively new building, built in 2007.',
          'Designed by BAR Architects and certified LEED Platinum in 2013, the SCC, while deservedly popular, is a chronic underperformer on its energy goals.'
        ],
        pSymbols: ['','','',''],
        pZoomLabels: ['','','',''],
        pStatboxes: [{c:['$311,000','/year']},{c:'$1.45 million'},{c:'$16,700'},{c:'$89,000'}],
        pLinks: [
          [{type: 'site', c: 'https://cru.ucdavis.edu/content/531-history-of-the-arc.htm'}, {type: 'www', c: 'http://eco.ucdavis.edu'}],
          [{type: 'article', c: 'https://localwiki.org/davis/Meyer_Hall'}, {type: 'data', c: 'http://ceed.ucdavis.edu'}],
          [{type: 'article', c: 'https://localwiki.org/davis/Warren_and_Leta_Giedt_Hall'}, {type: 'data', c: 'http://ceed.ucdavis.edu'}],
          [{type: 'site', c: 'http://www.bararch.com/work/academic-institutional/project/uc-davis-student-community-center'}]
        ]
      }
    ]
  },

  {
    id: 1, seedling: 'society',
    description: 'The stories and data in this series deal with issues of social justice and inequity on a large scale.',
    parts: [
        {
          values: [1300,950,1325,1050], customLo: 300,
          color: { ui: '#628976', monument: {hex: "#628976", bri: 1}, ring: '337946' },
          sound: ['schmoney1','schmoney2'],
          title: {
            pre: {c: 'U.S. WAGE INEQUITY', size: 18, margin: -.75},
            main: {c: ['Men\'s Weekly','Earnings'], size: 28, font: 'Droid Serif', weight: 400, margin: -.2},
            post: {c: ['w/ Bachelor\'s degree,','working full-time','(median)'], size: 14, margin: .85},
            fuckers: {c: '', margin: -2.5}
          },
          maintext: 'In 2013, women in the US earned 82 cents to every dollar a man made. Stats from the Bureau of Labor Statistics show that income is staggered by both race and gender. Shown is a comparison of median weekly earnings between bachelor\'s degree holders.',

          pNames: ['White Men','Black Men','Asian Men','Hispanic Men'],
          pTexts: ['','','',''],
          pSymbols: [
            {type: 'img', src:'whiteman'},
            {type: 'img', src:'blackman'},
            {type: 'img', src:'asianman'},
            {type: 'img', src:'hispman'}
          ],
          pZoomLabels: ['','','',''],
          pStatboxes: [
            {c:['$1300','weekly'], size: [24,14], font: ['Droid Serif','Karla']},
            {c:['$950','weekly'], size: [24,14], font: ['Droid Serif','Karla']},
            {c:['$1325','weekly'], size: [24,14], font: ['Droid Serif','Karla']},
            {c:['$1050','weekly'], size: [24,14], font: ['Droid Serif','Karla']}],
          pLinks: [
          [{type:'data',c:'http://www.infoplease.com/ipa/A0882775.html'}],
          [{type: 'tw2', c: 'https://twitter.com/eveewing/status/648282820079693824'}],
          '','']
        }, //end part 0
        {
          values: [950,870,1040,815], customHi: 1325, customLo: 300,
          title: {
            pre: {c: 'U.S. WAGE INEQUITY', size: 18, margin: -.75},
            main: {c: ['Women\'s Weekly','Earnings'], size: 23, font: 'Droid Serif', weight: 400},
            post: {c: ['w/ Bachelor\'s degree,','working full-time','(median)'], size: 14, margin: .7},
            fuckers: {c: '', margin: -2.5}
          },
          maintext: 'The same data reveals that women make less than men of the same race at every level of education. This gives the lie to the myth of education-as-equalizer; while less schooling tends to result in poverty for anyone, men - especially whites - benefit disproportionately from more education.', //recommended 230 character maximum
          color: { ui: '#626b66', monument: {hex: "#628976", bri: 0.5}, ring: '152821' },
          sound: ['schmoney1','schmoney2'],

          pNames: ['White Women','Black Women','Asian Women','Hispanic Women'],
          pTexts: [
            '',
            'Examining the data, Deborah Ashton of Harvard Business Review notes that black and Hispanic women "vie for last place on the earnings pyramid at every level of education".',
            'The gap between Asian women/men is the largest; Asian women earn 78 cents to every dollar their male counterparts earn (81% for whites).',
            'Examining the data, Deborah Ashton of Harvard Business Review notes that black and Hispanic women "vie for last place on the earnings pyramid at every level of education".'],
          pSymbols: [
            {type: 'img', src:'whitewoman'},
            {type: 'img', src:'blackwoman'},
            {type: 'img', src:'asianwoman'},
            {type: 'img', src:'hispwoman'}
          ],
          pZoomLabels: ['','','',''],
          pStatboxes: [
            {c:['$950','weekly'], size: [24,14], font: ['Droid Serif','Karla']},
            {c:['$870','weekly'], size: [24,14], font: ['Droid Serif','Karla']},
            {c:['$1040','weekly'], size: [24,14], font: ['Droid Serif','Karla']},
            {c:['$815','weekly'], size: [24,14], font: ['Droid Serif','Karla']}],
          pLinks: [
            [{type: 'data', c: 'https://hbr.org/resources/images/article_assets/2014/06/paygap2.jpg'},{type:'article',c:'https://hbr.org/2014/06/does-race-or-gender-matter-more-to-your-paycheck/'}],
            [{type: 'data', c: 'https://hbr.org/resources/images/article_assets/2014/06/paygap2.jpg'},{type:'article',c:'https://hbr.org/2014/06/does-race-or-gender-matter-more-to-your-paycheck/'}],
            [{type: 'data', c: 'https://hbr.org/resources/images/article_assets/2014/06/paygap2.jpg'},{type:'article',c:'https://hbr.org/2014/06/does-race-or-gender-matter-more-to-your-paycheck/'}],
            [{type: 'data', c: 'https://hbr.org/resources/images/article_assets/2014/06/paygap2.jpg'},{type:'article',c:'https://hbr.org/2014/06/does-race-or-gender-matter-more-to-your-paycheck/'}]
          ]
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
          pZoomLabels: ['','','',''],
          pStatboxes: [
            {c: '2,200,000'},
            {c: '1,658,000'},
            {c: '645,000'},
            {c: '608,000'}
          ],
          pLinks: [
            {type: 'site', c: 'https://www.aclu.org/prison-crisis'},
            {type: 'data', c: 'http://www.prisonstudies.org/highest-to-lowest/prison-population-total?field_region_taxonomy_tid=All'},
            {type: 'site', c: 'https://www.aclu.org/prison-crisis'},
            {type: 'data', c: 'http://www.prisonstudies.org/highest-to-lowest/prison-population-total?field_region_taxonomy_tid=All'}
          ]
        }
      ]
  },

  {
    id: 2, seedling: 'misc',
    description: 'These stories can be about anything - from silly to sobering - that didn\'t fit in the other two categories.',
    parts: [
      {
        values: [15,15.7,12,13.7], customLo: 10,
        color: { ui: '#339167', monument: {hex: "#339167", bri: 1}, ring: '24BB48' },
        sound: ['cheer1','cheer2'],
        title: {
          pre: {c: 'The Cost of Education', size: 12},
          main: {c: ['Average Annual', 'Cost'], size: 24, font: 'Droid Serif'},
          post: {c: 'thank god you dont go to NYU', size: 12}
        },
        maintext: 'In September, the U.S. Department of Education launched a \'College Scorecard\' website, powered by open data and designed to help students & their families make informed decisions about attending university.',

        pNames: ['UC Davis', 'UC Davis', ['New York', 'University'], 'Academy of Art'],
        pTexts: ['','','',''],
        pSymbols: [
          {type: 'img', src: 'ucd'},
          {type: 'img', src: 'cal'},
          {type: 'img', src: 'nyu'},
          {type: 'img', src: 'aau'}
        ],
        pZoomLabels: ['','','',''],
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
        pZoomLabels: ['','','',''],
        pStatboxes: [
          {c:'$57k / year'}, {c: '$80.9k / year'}, {c:'$55.8k / year'}, {c: '$62k / year' }
        ],
        pLinks: ['','','','']
      }, //end part 0

    ]
  }
]
