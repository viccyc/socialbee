let db = {
    users: [
        {
            userId: 'Uggi93Fe0xaAPKhoWkJrhVG7tIp2',
            email: 'user@email.com',
            handle: 'user',
            createdAt: '2019-09-03T21:23:37.138Z',
            imageUrl: 'image/33021548',
            bio: 'Hello, my name is user. Nice to meet you',
            website: 'https://user.com',
            location: 'Calgary, Canada'
        }
    ],
    buzzes: [
        {
            userHandle: 'user',
            body: 'this is the buzz body',
            createdAt: '2019-09-03T21:38:15.623Z',
            likeCount: 5,
            commentCount: 2
        }
    ],
    comments: [
        {
            userHandle: 'user',
            buzzId: 'sakdfhalsdjfaldkfjalsf',
            body: 'this is the buzz body',
            createdAt: '2019-09-03T21:38:15.623Z',
        }
    ]
};

const userDetails = {
  // Redux data
  credentials: {
      userId: 'NASEFJASFJASDF2342',
      email: 'user@email.com',
      handle: 'user',
      createdAt: '2019-09-03T21:23:37.138Z',
      imageUrl: 'image/33021548',
      bio: 'Hello, my name is user. Nice to meet you',
      website: 'https://user.com',
      location: 'Calgary, Canada'
  },
  likes: [
      {
          userHandle: 'user',
          buzzId: 'hkljhlkj76fiyt7'
      },
      {
          userHandle: 'user',
          buzzId: 'ggyyuy098086frfdd'
      }
  ]
};
