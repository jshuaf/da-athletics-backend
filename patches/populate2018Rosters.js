const model =require('../model/model');
const Roster = require('../model/Roster');

const wrongTeamData = [ { _id: '58de6d7c113938a66dde0f77',
    url: 'https://deerfield.edu/athletics/teams/varsity-girls-soccer/' },
  { _id: '58de6d7c113938a66dde0f79',
    url: 'https://deerfield.edu/athletics/teams/junior-varsity-coed-cross-country/' },
  { _id: '58de6d7c113938a66dde0f7b',
    url: 'https://deerfield.edu/athletics/teams/varsity-girls-cross-country/' },
  { _id: '58de6d7d113938a66dde0f7d',
    url: 'https://deerfield.edu/athletics/teams/varsity-football/' },
  { _id: '58de6d7d113938a66dde0f7f',
    url: 'https://deerfield.edu/athletics/teams/varsity-field-hockey/' },
  { _id: '58de6d7d113938a66dde0f81',
    url: 'https://deerfield.edu/athletics/teams/varsity-boys-water-polo/' },
  { _id: '58de6d7d113938a66dde0f84',
    url: 'https://deerfield.edu/athletics/teams/varsity-boys-soccer/' },
  { _id: '58de6d7d113938a66dde0f85',
    url: 'https://deerfield.edu/athletics/teams/varsity-boys-cross-country/' },
  { _id: '58de6d7e113938a66dde0f86',
    url: 'https://deerfield.edu/athletics/teams/junior-varsity-boys-soccer/' },
  { _id: '58de6d7e113938a66dde0f89',
    url: 'https://deerfield.edu/athletics/teams/varsity-volleyball/' },
  { _id: '58de6d83113938a66dde0f8b',
    url: 'https://deerfield.edu/athletics/teams/varsity-girls-swimming-and-diving/' },
  { _id: '58de6d83113938a66dde0f8d',
    url: 'https://deerfield.edu/athletics/teams/varsity-boys-swimming-and-diving/' },
  { _id: '58de6d84113938a66dde0f8f',
    url: 'https://deerfield.edu/athletics/teams/junior-varsity-girls-hockey/' },
  { _id: '58de6d84113938a66dde0f91',
    url: 'https://deerfield.edu/athletics/teams/varsity-girls-squash/' },
  { _id: '58de6d85113938a66dde0f92',
    url: 'https://deerfield.edu/athletics/teams/thirds-girls-squash/' },
  { _id: '58de6daa18dc35a84a12b618',
    url: 'https://deerfield.edu/athletics/teams/junior-varsity-girls-squash/' },
  { _id: '58de6daa18dc35a84a12b61c',
    url: 'https://deerfield.edu/athletics/teams/varsity-boys-squash/' },
  { _id: '58de6daa18dc35a84a12b61d',
    url: 'https://deerfield.edu/athletics/teams/junior-varsity-boys-basketball/' },
  { _id: '58de6daa18dc35a84a12b620',
    url: 'https://deerfield.edu/athletics/teams/varsity-girls-hockey/' },
  { _id: '58de6dab18dc35a84a12b625',
    url: 'https://deerfield.edu/athletics/teams/varsity-boys-basketball/' },
  { _id: '58de6dab18dc35a84a12b623',
    url: 'https://deerfield.edu/athletics/teams/varsity-coed-wrestling/' },
  { _id: '58de6dab18dc35a84a12b627',
    url: 'https://deerfield.edu/athletics/teams/varsity-girls-basketball/' },
  { _id: '58de6dab18dc35a84a12b629',
    url: 'https://deerfield.edu/athletics/teams/junior-varsity-boys-hockey/' },
  { _id: '58de6dab18dc35a84a12b62a',
    url: 'https://deerfield.edu/athletics/teams/varsity-boys-hockey/' },
  { _id: '58de6dae18dc35a84a12b62d',
    url: 'https://deerfield.edu/athletics/teams/varsity-alpine-skiing/' },
  { _id: '58de6db218dc35a84a12b62e',
    url: 'https://deerfield.edu/athletics/teams/junior-varsity-boys-squash/' },
  { _id: '58de6db218dc35a84a12b630',
    url: 'https://deerfield.edu/athletics/teams/junior-varsity-coed-swimming-and-diving/' },
  { _id: '58de6db218dc35a84a12b631',
    url: 'https://deerfield.edu/athletics/teams/thirds-boys-basketball/' },
  { _id: '58de6db218dc35a84a12b632',
    url: 'https://deerfield.edu/athletics/teams/thirds-boys-squash/' },
  { _id: '58de6db318dc35a84a12b633',
    url: 'https://deerfield.edu/athletics/teams/junior-varsity-girls-basketball/' },
  { _id: '58de6dba18dc35a84a12b634',
    url: 'https://deerfield.edu/athletics/teams/thirds-volleyball/' },
  { _id: '58de6dbb18dc35a84a12b635',
    url: 'https://deerfield.edu/athletics/teams/junior-varsity-football/' },
  { _id: '58de6dbb18dc35a84a12b636',
    url: 'https://deerfield.edu/athletics/teams/junior-varsity-girls-soccer/' },
  { _id: '58de6dbb18dc35a84a12b637',
    url: 'https://deerfield.edu/athletics/teams/junior-varsity-field-hockey/' },
  { _id: '58de6dbb18dc35a84a12b638',
    url: 'https://deerfield.edu/athletics/teams/junior-b-boys-soccer/' },
  { _id: '58de6dbb18dc35a84a12b639',
    url: 'https://deerfield.edu/athletics/teams/reserve-girls-soccer/' },
  { _id: '58de6dbb18dc35a84a12b63a',
    url: 'https://deerfield.edu/athletics/teams/junior-varsity-volleyball/' },
  { _id: '58de6dbc18dc35a84a12b63c',
    url: 'https://deerfield.edu/athletics/teams/junior-a-boys-soccer/' },
  { _id: '58de6dbf18dc35a84a12b63d',
    url: 'https://deerfield.edu/athletics/teams/junior-varsity-boys-water-polo/' },
  { _id: '58de6dc418dc35a84a12b63e',
    url: 'https://deerfield.edu/athletics/teams/reserve-field-hockey/' },
  { _id: '58de6eab9a2005b511995d68',
    url: 'https://deerfield.edu/athletics/teams/varsity-girls-lacrosse/' },
  { _id: '58de6eab9a2005b511995d6a',
    url: 'https://deerfield.edu/athletics/teams/junior-varsity-coed-golf/' },
  { _id: '58de6eab9a2005b511995d6b',
    url: 'https://deerfield.edu/athletics/teams/thirds-girls-lacrosse/' },
  { _id: '58de6eab9a2005b511995d6d',
    url: 'https://deerfield.edu/athletics/teams/varsity-coed-golf/' },
  { _id: '58de6eab9a2005b511995d70',
    url: 'https://deerfield.edu/athletics/teams/varsity-softball/' },
  { _id: '58de6eab9a2005b511995d72',
    url: 'https://deerfield.edu/athletics/teams/varsity-coed-track/' },
  { _id: '58de6eab9a2005b511995d73',
    url: 'https://deerfield.edu/athletics/teams/varsity-girls-water-polo/' },
  { _id: '58de6eab9a2005b511995d74',
    url: 'https://deerfield.edu/athletics/teams/junior-varsity-boys-lacrosse/' },
  { _id: '58de6eab9a2005b511995d76',
    url: 'https://deerfield.edu/athletics/teams/junior-varsity-girls-tennis/' },
  { _id: '58de6eac9a2005b511995d77',
    url: 'https://deerfield.edu/athletics/teams/varsity-girls-tennis/' },
  { _id: '58de6eac9a2005b511995d79',
    url: 'https://deerfield.edu/athletics/teams/varsity-coed-cycling/' },
  { _id: '58de6eac9a2005b511995d7a',
    url: 'https://deerfield.edu/athletics/teams/varsity-boys-lacrosse/' },
  { _id: '58de6eac9a2005b511995d7b',
    url: 'https://deerfield.edu/athletics/teams/junior-varsity-girls-lacrosse/' },
  { _id: '58de6eac9a2005b511995d7d',
    url: 'https://deerfield.edu/athletics/teams/junior-varsity-baseball/' },
  { _id: '58de6eb29a2005b511995d7f',
    url: 'https://deerfield.edu/athletics/teams/varsity-boys-tennis/' },
  { _id: '58de6eb39a2005b511995d80',
    url: 'https://deerfield.edu/athletics/teams/varsity-baseball/' },
  { _id: '58de6eb39a2005b511995d82',
    url: 'https://deerfield.edu/athletics/teams/junior-varsity-boys-tennis/' },
  { _id: '58e84b88b1a131f4cbcf7b6a',
    url: 'https://deerfield.edu/athletics/teams/junior-varsity-coed-wrestling/' },
  { _id: '5b25311ae6061d05387c35aa',
    url: 'https://deerfield.edu/athletics/teams/varsity-coed-track-and-field/' },
  { _id: '5b2ce696c674949ead182c10',
    url: 'https://deerfield.edu/athletics/teams/varsity-girls-rowing/' },
  { _id: '5b2ce69fc674949ead182c1c',
    url: 'https://deerfield.edu/athletics/teams/novice-coed-rowing/' },
  { _id: '5b2ce715f0d8a99ef72f24c0',
    url: 'https://deerfield.edu/athletics/teams/varsity-boys-rowing/' },
  { _id: '5b2ce71ff0d8a99ef72f24c4',
    url: 'https://deerfield.edu/athletics/teams/rowing-coed-junior-varsity/' } ];
const newTeamData = [ { _id: '58f5eaeb7ffaa04314fb62c2',
    url: 'https://deerfield.edu/athletics/teams/varsity-football/' },
  { _id: '58f5eaeb7ffaa04314fb62c9',
    url:
     'https://deerfield.edu/athletics/teams/varsity-girls-soccer/' },
  { _id: '58f5eaeb7ffaa04314fb62d5',
    url:
     'https://deerfield.edu/athletics/teams/varsity-boys-water-polo/' },
  { _id: '58f5eaeb7ffaa04314fb62cd',
    url:
     'https://deerfield.edu/athletics/teams/varsity-field-hockey/' },
  { _id: '58f5eaeb7ffaa04314fb62c3',
    url: 'https://deerfield.edu/athletics/teams/varsity-volleyball/' },
  { _id: '58f5eaeb7ffaa04314fb62d1',
    url: 'https://deerfield.edu/athletics/teams/varsity-boys-soccer/' },
  { _id: '58f5eaec7ffaa04314fb62de',
    url:
     'https://deerfield.edu/athletics/teams/varsity-coed-cycling/' },
  { _id: '58f5eaec7ffaa04314fb62d6',
    url:
     'https://deerfield.edu/athletics/teams/varsity-boys-cross-country/' },
  { _id: '58f5eaec7ffaa04314fb62d9',
    url:
     'https://deerfield.edu/athletics/teams/varsity-girls-cross-country/' },
  { _id: '58f5eaec7ffaa04314fb62df',
    url:
     'https://deerfield.edu/athletics/teams/junior-varsity-coed-cross-country/' },
  { _id: '58f5eaec7ffaa04314fb62e4',
    url:
     'https://deerfield.edu/athletics/teams/thirds-girls-lacrosse/' },
  { _id: '58f5eaec7ffaa04314fb62e1',
    url: 'https://deerfield.edu/athletics/teams/varsity-coed-golf/' },
  { _id: '58f5eaec7ffaa04314fb62e2',
    url:
     'https://deerfield.edu/athletics/teams/junior-varsity-baseball/' },
  { _id: '58f5eaec7ffaa04314fb62e6',
    url:
     'https://deerfield.edu/athletics/teams/junior-varsity-girls-tennis/' },
  { _id: '58f5eaec7ffaa04314fb62e8',
    url:
     'https://deerfield.edu/athletics/teams/varsity-boys-lacrosse/' },
  { _id: '58f5eaec7ffaa04314fb62ea',
    url: 'https://deerfield.edu/athletics/teams/varsity-coed-track/' },
  { _id: '58f5eaec7ffaa04314fb62ef',
    url: 'https://deerfield.edu/athletics/teams/varsity-softball/' },
  { _id: '58f5eaec7ffaa04314fb62eb',
    url: 'https://deerfield.edu/athletics/teams/varsity-boys-tennis/' },
  { _id: '58f5eaec7ffaa04314fb62ed',
    url:
     'https://deerfield.edu/athletics/teams/junior-varsity-boys-tennis/' },
  { _id: '58f5eaec7ffaa04314fb62ee',
    url:
     'https://deerfield.edu/athletics/teams/varsity-girls-water-polo/' },
  { _id: '58f5eaec7ffaa04314fb62f1',
    url: 'https://deerfield.edu/athletics/teams/varsity-baseball/' },
  { _id: '58f5eaec7ffaa04314fb62f3',
    url:
     'https://deerfield.edu/athletics/teams/varsity-girls-lacrosse/' },
  { _id: '58f5eaed7ffaa04314fb62f4',
    url:
     'https://deerfield.edu/athletics/teams/junior-varsity-girls-lacrosse/' },
  { _id: '58f5eaed7ffaa04314fb62f5',
    url:
     'https://deerfield.edu/athletics/teams/junior-varsity-coed-golf/' },
  { _id: '58f5eaed7ffaa04314fb62f7',
    url:
     'https://deerfield.edu/athletics/teams/junior-varsity-boys-lacrosse/' },
  { _id: '58f5eaed7ffaa04314fb62f9',
    url:
     'https://deerfield.edu/athletics/teams/varsity-girls-tennis/' },
  { _id: '58f5eaf47ffaa04314fb630a',
    url:
     'https://deerfield.edu/athletics/teams/varsity-boys-swimming-and-diving/' },
  { _id: '58f5eaf47ffaa04314fb6305',
    url:
     'https://deerfield.edu/athletics/teams/varsity-girls-swimming-and-diving/' },
  { _id: '58f5eaf47ffaa04314fb630e',
    url: 'https://deerfield.edu/athletics/teams/varsity-boys-squash/' },
  { _id: '58f5eaf47ffaa04314fb630f',
    url:
     'https://deerfield.edu/athletics/teams/varsity-coed-wrestling/' },
  { _id: '58f5eaf47ffaa04314fb630c',
    url:
     'https://deerfield.edu/athletics/teams/varsity-girls-squash/' },
  { _id: '58f5eaf47ffaa04314fb6314',
    url:
     'https://deerfield.edu/athletics/teams/junior-varsity-boys-basketball/' },
  { _id: '58f5eaf47ffaa04314fb6315',
    url:
     'https://deerfield.edu/athletics/teams/junior-varsity-boys-hockey/' },
  { _id: '58f5eaf47ffaa04314fb6310',
    url:
     'https://deerfield.edu/athletics/teams/junior-varsity-girls-hockey/' },
  { _id: '58f5eaf47ffaa04314fb6319',
    url: 'https://deerfield.edu/athletics/teams/varsity-boys-hockey/' },
  { _id: '58f5eaf47ffaa04314fb631a',
    url:
     'https://deerfield.edu/athletics/teams/varsity-boys-basketball/' },
  { _id: '58f5eaf47ffaa04314fb631b',
    url:
     'https://deerfield.edu/athletics/teams/junior-varsity-boys-squash/' },
  { _id: '58f5eaf47ffaa04314fb631c',
    url:
     'https://deerfield.edu/athletics/teams/junior-varsity-girls-squash/' },
  { _id: '58f5eaf57ffaa04314fb631d',
    url:
     'https://deerfield.edu/athletics/teams/varsity-girls-basketball/' },
  { _id: '58f5eaf57ffaa04314fb6320',
    url:
     'https://deerfield.edu/athletics/teams/varsity-girls-hockey/' },
  { _id: '58f5eaf57ffaa04314fb631e',
    url:
     'https://deerfield.edu/athletics/teams/thirds-boys-basketball/' },
  { _id: '58f5eaf57ffaa04314fb631f',
    url:
     'https://deerfield.edu/athletics/teams/varsity-alpine-skiing/' },
  { _id: '58f5eaf57ffaa04314fb6322',
    url:
     'https://deerfield.edu/athletics/teams/junior-varsity-girls-basketball/' },
  { _id: '58f5eaf57ffaa04314fb6324',
    url: 'https://deerfield.edu/athletics/teams/thirds-girls-squash/' },
  { _id: '58f5eaf57ffaa04314fb6325',
    url: 'https://deerfield.edu/athletics/teams/thirds-boys-squash/' },
  { _id: '58f5eaf57ffaa04314fb6326',
    url:
     'https://deerfield.edu/athletics/teams/junior-varsity-coed-swimming-and-diving/' },
  { _id: '58f5eafe7ffaa04314fb6327',
    url:
     'https://deerfield.edu/athletics/teams/junior-varsity-field-hockey/' },
  { _id: '58f5eafe7ffaa04314fb6328',
    url:
     'https://deerfield.edu/athletics/teams/junior-varsity-football/' },
  { _id: '58f5eafe7ffaa04314fb6329',
    url:
     'https://deerfield.edu/athletics/teams/junior-varsity-girls-soccer/' },
  { _id: '58f5eafe7ffaa04314fb632a',
    url:
     'https://deerfield.edu/athletics/teams/reserve-girls-soccer/' },
  { _id: '58f5eafe7ffaa04314fb632b',
    url:
     'https://deerfield.edu/athletics/teams/junior-a-boys-soccer/' },
  { _id: '58f5eafe7ffaa04314fb632c',
    url: 'https://deerfield.edu/athletics/teams/thirds-volleyball/' },
  { _id: '58f5eafe7ffaa04314fb632d',
    url:
     'https://deerfield.edu/athletics/teams/junior-varsity-boys-soccer/' },
  { _id: '58f5eafe7ffaa04314fb632e',
    url:
     'https://deerfield.edu/athletics/teams/junior-varsity-volleyball/' },
  { _id: '58f5eafe7ffaa04314fb6331',
    url:
     'https://deerfield.edu/athletics/teams/junior-b-boys-soccer/' },
  { _id: '58f5eaff7ffaa04314fb6332',
    url:
     'https://deerfield.edu/athletics/teams/junior-varsity-boys-water-polo/' },
  { _id: '58f5eaff7ffaa04314fb6333',
    url:
     'https://deerfield.edu/athletics/teams/reserve-field-hockey/' },
  { _id: '5aad7c5d534ea6364951df92',
    url: 'https://deerfield.edu/athletics/teams/varsity-boys-rowing/' },
  { _id: '5abfe2fd37e9e427aac4a4c2',
    url:
     'https://deerfield.edu/athletics/teams/varsity-girls-rowing/' },
  { _id: '5b2531dca2d2965bed46ba8d',
    url:
     'https://deerfield.edu/athletics/teams/varsity-coed-track-and-field/' },
  { _id: '5b2531dca2d2965bed46ba8e',
    url:
     'https://deerfield.edu/athletics/teams/rowing-coed-junior-varsity/' },
  { _id: '5b25326fa2d2965bed46ba8f',
    url: 'https://deerfield.edu/athletics/teams/novice-coed-rowing/' },
  { _id: '5b253274a2d2965bed46ba9b',
    url:
     'https://deerfield.edu/athletics/teams/junior-varsity-coed-wrestling/' } ]

wrongTeamData.forEach((team) => {
	Roster.findOne({team: team._id}).then((roster) => {
		console.log('hi');
		const newTeam = newTeamData.filter(x => x.url == team.url)
		return Roster.findByIdAndUpdate(roster._id, {team: newTeam._id})
	}).then(() => {
		console.log('done')
	}).catch((err) => {
		console.error(err)
	})
})
