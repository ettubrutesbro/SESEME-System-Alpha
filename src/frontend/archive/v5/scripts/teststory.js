
var teststory = {
  id: 1,
  // title: 'Ungreen & Uncool',
  parts: [
    {
      title: 'Distant Glories',
      info: 'In 2012, UC Davis was named the "coolest school" in the US by the Sierra Club. The award celebrates campus environmental responsibility in categories like energy use, waste management, food sources, and education. But a lot has changed since then...',
      dataset: 'COOL SCHOOL RANK \'12',
      // dataset: ['SIERRA CLUB RANK, \'12', 'COOLEST SCHOOLS RANK', 'COOS C', 'SLEEP NOW'],
      pointValues: [1,3,9,20], rangeType: 'lessIsTall' , customMin: 22,
      pointNames: ['UC Davis', 'Stanford', 'UC Irvine', 'UC Berkeley'],
      // pointNames: 'suck me dik ho',
      pointCaptions: ['COOLEST SCHOOL 2012', 'SUPPOSEDLY 3RD', '#9 COOL SCHOOL', '20th \'COOLEST\''],
      pointText: ['2 years ago, we drew praise for our \'well-rounded\' environmental efforts, including bicycle infrastructure and waste diversion.”'
      ,'Barely behind us, Stanford earned honors for its commitment to sustainable agriculture in class and cafeteria.'
      ,'Then the closest-ranked UC behind Davis, Irvine was noted for its many extracurricular environmental groups and recycling efforts.'
      ,''],
      // pointRanges: [[0,10],[10,0],[],[]], for disassociated rangeType, first number low, second number high
      color: '#339167',
      motionOrder: 'unison', motionTypes: 'bit',
      // pointGeos: ['cowface','stan_tree','anteater','ucb_bear'],
      // plrMotions: 'smooth', globalMotion: 'unisonEnd',
      // suppData: [{vid: '', url: '', img: ''}, {}, {}, {}]
    },
    {
      title: 'Fall from Grace',
      // pointNames: 'yo mamas crib',
      pointNames: ['UC Davis', 'Stanford', 'UC Irvine', 'UC Berkeley'],
      info: 'Since then, our sustainability rank has fallen precipitously: in their most recent Coolest School report, UC Davis ranked #55 - eclipsed by nearly every UC, and many schools near, far, public, and private.',
      // pointNames: ['','differentB','','nuttin'],
      dataset: 'COOL SCHOOL RANK \'14',
      // dataset: ['WTF MAN','ray','man','go'],
      pointValues: [55,6,1,33], rangeType: 'lessIsTall',
      pointCaptions: ['NO LONGER \'COOL\'','6th IN 2014','THE NEW #1','ALSO NOW AHEAD OF US'],
      pointText: ['Aenean urna erat, lacinia in hendrerit id, rutrum et est. Suspendisse potenti. Vestibulum sit amet sem ultricies, sagittis augue at posuere.'
      ,'Mauris finibus erat eros, vel porta lacus vehicula et. Sed eget ex non nisl sollicitudin sollicitudin. Fusce sollicitudin tristique posuere.'
      ,'Nunc tempus justo rutrum nisi consequat elementum. Vestibulum leo mi, vehicula sed dignissim viverra, vulputate sed est. Nam aliquet nullam.'
      ,'Nulla eu tortor tincidunt, ultrices nisl at, blandit augue. Donec ut sem sollicitudin nulla condimentum ullamcorper id at lorem turpis duis.'],
      // motionOrder: {delay: [0,100,500,1000]}
      // motionType: {bit: 'large'}, motionOrder: 'altbiped'
      // motionType: {bit: 'large'}
      motionOrder: 'sync'
    },
    {
      title: 'Eastern Shade',
      pointNames: ['UC Davis', 'Stanford', 'UC Irvine', ['UC Santa','Barbara']],
      dataset: 'Princeton\'s Green 50',
      pointValues: [40, 22, 16, 3], rangeType: 'lessIsTall',
      color: '#990818',
      // motionType: {bit: 3}
      motionOrder: 'altbiped', motionType: {bit: 3}
    },
    {
      title: 'Do Better plz',
      pointValues: [0,0,0,0],
      text: ''
    }
  ]


}
