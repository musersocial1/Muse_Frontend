import { LongFormContent, Post } from "@/types/community";
import { Category } from "@/types/discover";
import { VideoComment } from "@/types/post";
import { images } from "./images";

export const dummyAllPosts: Post[] = [
  {
    id: "new4",
    author: {
      name: "Maya Patel",
      username: "maya_innovates",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      verified: true,
    },
    images: [images.Newpost4],
    aspectRatio: "16:9",
    content:
      "Great pod. They're arguing that biology is the new software stack. Not just building apps, but building life-systems. What struck me: when a startup says 'we'll build something in 10 years', it usually dies. Their bet: they'll build something that spans 10–15 years. Image",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/68.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/69.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/70.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/71.jpg",
      },
    ],
    timestamp: "3h",
    likes: 2678,
    comments: 893,
    type: "image",
  },
  {
    id: "new7",
    author: {
      name: "Jordan Mitchell",
      username: "jordan_tech",
      avatar: "https://randomuser.me/api/portraits/men/54.jpg",
      verified: false,
    },
    images: [images.Newpost7],
    aspectRatio: "4:5",
    content:
      "Feels like a lifetime ago when apple was actually innovating. Image",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/80.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/81.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/82.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/83.jpg",
      },
    ],
    timestamp: "3h",
    likes: 2678,
    comments: 893,
    type: "image",
  },

  {
    id: "new2",
    author: {
      name: "Alexis Rivera",
      username: "alexis_builds",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      verified: true,
    },
    images: [images.one_4_5],
    aspectRatio: "4:5",
    content:
      "Everyone says 'build something people want.' I say: build something people can't stop talking about. That's where the magic happens.",
    timestamp: "45m",
    likes: 1542,
    comments: 234,
    type: "text",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/64.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/65.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/66.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/67.jpg",
      },
    ],
  },

  {
    id: "new10",
    author: {
      name: "Kai Anderson",
      username: "kai_founder",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      verified: true,
    },
    images: [images.Newpost10],
    aspectRatio: "4:5",
    content:
      "The goal is to build a company lina khan wants to break up in 20 years. Until then, build on! YC2025 ",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/88.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/89.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/90.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/91.jpg",
      },
    ],
    timestamp: "3h",
    likes: 2678,
    comments: 893,
    type: "image",
  },

  {
    id: "new12",
    author: {
      name: "Nina Torres",
      username: "nina_startup",
      avatar: "https://randomuser.me/api/portraits/women/58.jpg",
      verified: false,
    },
    images: [images.Newpost12],
    aspectRatio: "1:1",
    content:
      "Hey everyone at YC, this is my first start up but i wanted to ask - How did you know when to stop iterating on your product and start focusing on getting your first paying customers?",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/84.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/85.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/86.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/87.jpg",
      },
    ],
    timestamp: "3h",
    likes: 2678,
    comments: 893,
    type: "image",
  },

  {
    id: "new9",
    author: {
      name: "Derek Zhang",
      username: "derek_strategy",
      avatar: "https://randomuser.me/api/portraits/men/72.jpg",
      verified: true,
    },
    images: [images.Newpost9],
    aspectRatio: "16:9",
    content:
      "That's a powerful reframing — but for many founders, the risk isn't just where you build, it's how fast you iterate. Ignoring 'software first' because you're chasing rare atoms can lead to paralysis by domain. ",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/88.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/89.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/90.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/91.jpg",
      },
    ],
    timestamp: "3h",
    likes: 2678,
    comments: 893,
    type: "image",
  },

  {
    id: "new14",
    author: {
      name: "Bella Santos",
      username: "bella_stealth",
      avatar: "https://randomuser.me/api/portraits/women/67.jpg",
      verified: false,
    },
    images: [images.Newpost14],
    aspectRatio: "4:5",
    content: 'calling it "building in stealth" instead of "unemployed" ',
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/84.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/85.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/86.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/87.jpg",
      },
    ],
    timestamp: "3h",
    likes: 2678,
    comments: 893,
    type: "image",
  },

  {
    id: "new3",
    author: {
      name: "Olivia Chen",
      username: "olivia_networks",
      avatar: "https://randomuser.me/api/portraits/women/73.jpg",
      verified: true,
    },
    images: [images.one_16_9],
    aspectRatio: "16:9",
    content:
      "The next Silicon Valley won't be a place — it'll be a network. Founders, users, and capital already move faster than geography. The ones who build for that distributed reality — who see community as infrastructure, not marketing — will own the next decade.",
    timestamp: "1h",
    likes: 3421,
    thumbnail: images.latest2,
    comments: 567,
    type: "text",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/38.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/39.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/40.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/41.jpg",
      },
    ],
  },

  {
    id: "new5",
    author: {
      name: "Lucas Harper",
      username: "lucas_ai",
      avatar: "https://randomuser.me/api/portraits/men/88.jpg",
      verified: true,
    },
    images: [images.Newpost5],
    aspectRatio: "16:9",
    content:
      " I get what Andrew Ross Sorkin is saying here — but what about when the next major AI regulation hits and the entire distribution model for content gets rewired? How are founders preparing for that shift?",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/72.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/73.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/74.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/75.jpg",
      },
    ],
    timestamp: "3h",
    likes: 2678,
    comments: 893,
    type: "image",
  },

  {
    id: "new16",
    author: {
      name: "Sophie Kim",
      username: "sophie_rides",
      avatar: "https://randomuser.me/api/portraits/women/91.jpg",
      verified: false,
    },
    images: [images.Newpost16],
    aspectRatio: "16:9",
    content:
      " I swear the best product ideas come from zooming down the SF coast at 40mph (or from talking to me:) Looking for a few founders to start a biking crew with. 2-4 hrs Saturday mornings loop around all of SF to start, Marin and Berkeley next DM me if you'd be down! ",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/84.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/85.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/86.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/87.jpg",
      },
    ],
    timestamp: "3h",
    likes: 2678,
    comments: 893,
    type: "image",
  },

  {
    id: "new15",
    author: {
      name: "Max Coleman",
      username: "max_ships",
      avatar: "https://randomuser.me/api/portraits/men/94.jpg",
      verified: true,
    },
    images: [images.Newpost15],
    aspectRatio: "4:5",
    content:
      "Ready to ship a new feature this weekend at vibecon - ycombinator HQ w/@MadlenerNikolai @getmiora ",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/84.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/85.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/86.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/87.jpg",
      },
    ],
    timestamp: "3h",
    likes: 2678,
    comments: 893,
    type: "image",
  },

  {
    id: "new8",
    author: {
      name: "Aria Thompson",
      username: "aria_tests",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      verified: true,
    },
    images: [images.Newpost8],
    aspectRatio: "16:9",
    content:
      "Anyone around Byd Park, SF ? We're looking for people to test out some of new features. Willing to connect and help out down the line too. Image",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/84.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/85.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/86.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/87.jpg",
      },
    ],
    timestamp: "3h",
    likes: 2678,
    comments: 893,
    type: "image",
  },

  {
    id: "new13",
    author: {
      name: "Ethan Brooks",
      username: "ethan_ventures",
      avatar: "https://randomuser.me/api/portraits/men/76.jpg",
      verified: false,
    },
    images: [images.Newpost13],
    aspectRatio: "4:5",
    content: "The one trillion dollar man. ",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/84.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/85.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/86.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/87.jpg",
      },
    ],
    timestamp: "3h",
    likes: 2678,
    comments: 893,
    type: "image",
  },

  {
    id: "new1",
    author: {
      name: "Zoe Martinez",
      username: "zoe_metrics",
      avatar: "https://randomuser.me/api/portraits/women/53.jpg",
      verified: true,
    },
    images: [images.Newpost1],
    aspectRatio: "16:9",
    content:
      "We turned off our analytics dashboard for a week and tracked nothing but raw user behavior. What we found: users weren't clicking fancy features—they were simply 'sticking' if the core loop worked. The rest? Noise. Has anyone else pulled the plug on metrics to find truth?",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/60.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/61.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/62.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/63.jpg",
      },
    ],
    timestamp: "3h",
    likes: 2678,
    comments: 893,
    type: "image",
  },

  {
    id: "new6",
    author: {
      name: "Ryan Cooper",
      username: "ryan_search",
      avatar: "https://randomuser.me/api/portraits/men/82.jpg",
      verified: true,
    },
    images: [images.Newpost6],
    aspectRatio: "16:9",
    content:
      "Aravind is saying Perplexity wins by forcing every answer to be backed by citations. Smart. But in my startup I'm watching that timing, UX and integration beat perfect citation every time. What do you think: is the citation criterion the moat—or just a nice-to-have?",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/76.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/77.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/78.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/79.jpg",
      },
    ],
    timestamp: "3h",
    likes: 2678,
    comments: 893,
    type: "image",
  },

  {
    id: "new11",
    author: {
      name: "Mia Johnson",
      username: "mia_grinds",
      avatar: "https://randomuser.me/api/portraits/women/88.jpg",
      verified: false,
    },
    images: [images.Newpost11],
    aspectRatio: "4:5",
    content:
      "All those late nights, weekend grinds, and quiet moments when no one's watching, they'll pay off. One day you'll look back and be proud of the person who never gave up. Everyone's journey has its own timing ",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/88.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/89.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/90.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/91.jpg",
      },
    ],
    timestamp: "3h",
    likes: 2678,
    comments: 893,
    type: "image",
  },

  {
    id: "1",
    author: {
      name: "Tyler Reed",
      username: "tyler_podcasts",
      avatar: "https://randomuser.me/api/portraits/men/58.jpg",
      verified: true,
    },
    images: [images.one_1_1],
    aspectRatio: "1:1",
    content:
      "Friedberg should have his own podcast, along with Chamath ... and Sacks. hm.. What am I trying to say here?",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/92.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/93.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/94.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/95.jpg",
      },
    ],
    timestamp: "3h",
    likes: 2678,
    comments: 893,
    type: "image",
  },
  {
    id: "2",
    author: {
      name: "Liam Davis",
      username: "liam_debates",
      avatar: "https://randomuser.me/api/portraits/men/62.jpg",
      verified: false,
    },
    images: [images.one_4_5],
    aspectRatio: "4:5",
    content:
      "Jason's arguments on the Kimmel situation no different from his apology to Palmer Luckey for getting him fired…not the truth but just a token gesture which has clearly been rejected by him…",
    timestamp: "45m",
    likes: 1542,
    comments: 234,
    type: "image",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/96.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/97.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/98.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/99.jpg",
      },
    ],
  },
  {
    id: "3",
    author: {
      name: "Chloe Anderson",
      username: "chloe_policy",
      avatar: "https://randomuser.me/api/portraits/women/78.jpg",
      verified: true,
    },
    images: [images.one_16_9],
    aspectRatio: "16:9",
    content:
      "Would Elon Musk have been able to do his first start up if there was a $100k fee for H1-B? Elon promised to go to war over H1-B but I don't think he has said anything about the new rules.",
    timestamp: "1h",
    likes: 3421,
    thumbnail: images.latest2,
    comments: 567,
    type: "image",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/38.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/39.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/40.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/41.jpg",
      },
    ],
  },
  {
    id: "4",
    author: {
      name: "Aiden Wu",
      username: "aiden_immigration",
      avatar: "https://randomuser.me/api/portraits/men/71.jpg",
      verified: false,
    },
    content:
      "I missed the H1B lottery 5 times. There are 60 days of grace period on H1B, not 30. Funny how you guys didn't discuss that Trump came on your pod and promised green cards to international students. What is an average wage out of college?",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/10.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/11.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/12.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/13.jpg",
      },
    ],
    timestamp: "6h",
    likes: 892,
    comments: 156,
    type: "text",
  },
  {
    id: "5",
    author: {
      name: "Brooklyn Foster",
      username: "brooklyn_media",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      verified: true,
    },
    content:
      'Jason needs to watch the Kimmel clip again, this time very carefully. Kimmel DID say the kid was MAGA, perhaps not directly, but it was heavily implied. Seriously, why does Jason think the FCC was so annoyed at Kimmel"s comments?',
    videos: [images.mainpost5],
    thumbnail: images.mainpost5,
    timestamp: "12m",
    likes: 4567,
    comments: 1023,
    type: "video",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/14.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/15.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/16.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/17.jpg",
      },
    ],
  },
  {
    id: "6",
    communityName: "Chef Valentina",
    author: {
      name: "Luna Garcia",
      username: "luna_foodie",
      avatar: "https://randomuser.me/api/portraits/women/34.jpg",
      verified: true,
    },
    content: "Be honest, what's the best drink for this meal ?",
    images: [images.two_1_1],
    aspectRatio: "1:1",
    timestamp: "2h",
    likes: 2156,
    comments: 445,
    type: "image",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/18.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/19.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/20.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/21.jpg",
      },
    ],
  },
  {
    id: "7",
    communityName: "Mentors united",
    author: {
      name: "Mason Taylor",
      username: "mason_hustle",
      avatar: "https://randomuser.me/api/portraits/men/86.jpg",
      verified: false,
    },
    images: [images.two_4_5],
    aspectRatio: "4:5",
    content:
      "Bro to bro: If you can grind 18 hours a day, 7 days a week. No days off. Just God, hustle, eat, sleep. You will find a way out from your messed up life",
    timestamp: "4h",
    likes: 1789,
    comments: 334,
    type: "image",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/22.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/23.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/24.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/25.jpg",
      },
    ],
  },
  {
    id: "8",
    communityName: "Tesla Super Owners",
    author: {
      name: "Noah Bennett",
      username: "noah_tesla",
      avatar: "https://randomuser.me/api/portraits/men/91.jpg",
      verified: true,
    },
    content: "Elon with optimus Caption this",
    videos: [images.mainpost5],
    thumbnail: images.mainpost8,
    timestamp: "30m",
    likes: 5234,
    comments: 876,
    type: "video",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/26.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/27.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/28.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/29.jpg",
      },
    ],
  },
  {
    id: "9",
    communityName: "Tesla Super Owners",
    author: {
      name: "Ava Rodriguez",
      username: "ava_autonomous",
      avatar: "https://randomuser.me/api/portraits/women/87.jpg",
      verified: false,
    },
    content: "LiDAR is absolutely game-changing technology",
    videos: [images.mainpost9],
    thumbnail: images.mainpost9,
    timestamp: "1h",
    likes: 3456,
    comments: 567,
    type: "video",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/30.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/31.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/32.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/33.jpg",
      },
    ],
  },
  {
    id: "10",
    author: {
      name: "Sanjay Kapoor",
      username: "sanjay_visa",
      avatar: "https://randomuser.me/api/portraits/men/79.jpg",
      verified: false,
    },
    images: [images.three_1_1],
    aspectRatio: "1:1",
    content:
      "This is heartbreaking. Many folks are waiting for green cards for decades but unfortunately they have to be on non immigrant visa because USA doesn't have an intermediary status. There hasn't been discussion on this in the podcast, very disappointing...",
    timestamp: "8h",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/34.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/35.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/36.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/37.jpg",
      },
    ],
    likes: 1234,
    comments: 445,
    type: "image",
  },
  {
    id: "11",
    author: {
      name: "Harper Lee",
      username: "harper_critic",
      avatar: "https://randomuser.me/api/portraits/women/92.jpg",
      verified: true,
    },
    images: [images.two_16_9],
    aspectRatio: "16:9",
    content:
      "Last week Chamath and Sacks say no one watches Kimmel and cited his poor ratings but this week say Kimmel was the leading voice? How does that math make sense if no one watches him? Let's try to stay consistent here.",
    timestamp: "5h",
    likes: 2890,
    comments: 678,
    type: "image",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/38.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/39.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/40.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/41.jpg",
      },
    ],
  },
  {
    id: "12",
    author: {
      name: "Iris Nakamura",
      username: "iris_h1b",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg",
      verified: false,
    },
    images: [images.three_4_5],
    aspectRatio: "4:5",
    content:
      "While your analysis of H1B problems was good, it completely ignores the rampant corruption by those processing applicants. The average applicant nets only about half the salary after kickbacks and fraud. Indenture servitude is a very real issue.",
    timestamp: "3h",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/42.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/43.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/45.jpg",
      },
    ],
    likes: 1567,
    comments: 289,
    type: "image",
  },
  {
    id: "13",
    author: {
      name: "Diego Silva",
      username: "diego_corporate",
      avatar: "https://randomuser.me/api/portraits/men/68.jpg",
      verified: true,
    },
    images: [images.four_1_1],
    aspectRatio: "1:1",
    content:
      "Thank you for exposing the abusive practices by Wipro, Infosys, HCLTech and Cognizant. Don't forget how big US companies leverage them with a two-tiered contractor system allowing zero notice terminations.",
    timestamp: "7h",
    likes: 3245,
    comments: 567,
    type: "image",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/46.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/47.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/48.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/49.jpg",
      },
    ],
  },
  {
    id: "14",
    author: {
      name: "Jade Williams",
      username: "jade_watcher",
      avatar: "https://randomuser.me/api/portraits/women/76.jpg",
      verified: false,
    },
    images: [images.three_16_9],
    aspectRatio: "16:9",
    content:
      'I like how these guys said they dont do ads on the pod, but every episode starts with a subtle "commentary ad" about a brand or product. Today was Emirates Airlines. You can fool everyone, but not me! Still a smart move though!',
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/50.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/51.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/52.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/53.jpg",
      },
    ],
    timestamp: "2h",
    likes: 1456,
    comments: 234,
    type: "image",
  },
  {
    id: "15",
    author: {
      name: "Phoenix Carter",
      username: "phoenix_style",
      avatar: "https://randomuser.me/api/portraits/women/89.jpg",
      verified: true,
    },
    content:
      "New season, new day! Whether it's street style, high fashion, or effortless chic, your outfit should always tell a story. Today I'm serving \"bold neutrals with a pop of color\" because confidence is the best accessory!",
    timestamp: "15m",
    likes: 45678,
    comments: 8923,
    type: "text",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/38.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/39.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/40.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/41.jpg",
      },
    ],
  },
  {
    id: "16",
    author: {
      name: "Rohan Gupta",
      username: "rohan_analyst",
      avatar: "https://randomuser.me/api/portraits/men/84.jpg",
      verified: true,
    },
    images: [images.five_1_1],
    aspectRatio: "1:1",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/54.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/55.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/56.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/57.jpg",
      },
    ],
    content:
      "Sacks hit the nail on the head. If the H-1B fee rises to $100,000 and registrations drop 80%, all 85,000 visas will still be used. The selection rate would jump from 19% to 94%, so I don't see why there's a meltdown over the fee.",
    timestamp: "4h",
    likes: 2789,
    thumbnail: images.latest2,
    comments: 445,
    type: "image",
  },
  {
    id: "17",
    author: {
      name: "Skylar Morgan",
      username: "skylar_future",
      avatar: "https://randomuser.me/api/portraits/women/51.jpg",
      verified: false,
    },
    images: [images.four_4_5],
    aspectRatio: "4:5",
    content:
      "The future of AI is not just about building smarter machines, it's about creating systems that understand human context and emotion. We're at an inflection point.",
    timestamp: "6h",
    likes: 3892,
    comments: 542,
    type: "image",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/113.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/114.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/115.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/116.jpg",
      },
    ],
  },
  {
    id: "18",
    author: {
      name: "Cameron Stone",
      username: "cameron_sv",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      verified: true,
    },
    images: [images.five_4_5],
    aspectRatio: "4:5",
    content:
      "After 10 years in Silicon Valley, I've learned that the best founders aren't the ones with the best ideas - they're the ones who execute relentlessly and adapt quickly.",
    timestamp: "9h",
    likes: 5234,
    comments: 789,
    type: "image",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/60.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/61.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/62.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/63.jpg",
      },
    ],
  },
  {
    id: "19",
    author: {
      name: "Morgan Ellis",
      username: "morgan_markets",
      avatar: "https://randomuser.me/api/portraits/women/94.jpg",
      verified: false,
    },
    images: [images.four_16_9],
    aspectRatio: "16:9",
    content:
      "Markets are showing interesting patterns this quarter. The divergence between tech and traditional sectors has never been more pronounced. Time to reassess portfolios?",
    timestamp: "11h",
    likes: 2345,
    comments: 398,
    type: "image",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/60.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/61.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/62.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/63.jpg",
      },
    ],
  },
  {
    id: "20",
    author: {
      name: "Julian Hayes",
      username: "julian_grind",
      avatar: "https://randomuser.me/api/portraits/men/92.jpg",
      verified: true,
    },
    content:
      "Hot take: The obsession with 'work-life balance' is overrated when you're building something from scratch. There's a season for everything, and the early days require sacrifice.",
    timestamp: "14h",
    likes: 1876,
    comments: 623,
    type: "text",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/60.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/61.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/women/62.jpg",
      },
      {
        type: "image",
        url: "https://randomuser.me/api/portraits/men/63.jpg",
      },
    ],
  },
];

// ADDITIONAL POSTS WITH REMAINING IMAGES
// Add these to your feed to use all 14 demo images:

export const dummyLongFormContent: LongFormContent[] = [
  {
    id: "1",
    title: "The travails of being a dancer in the modern age",
    thumbnail:
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=250&fit=crop",
    duration: "45:54",
    price: 32,
    isLocked: true,
    description:
      "An in-depth exploration of the challenges and rewards of pursuing dance professionally in today's world.",
  },
  {
    id: "2",
    title: "Mastering Contemporary Dance Techniques",
    thumbnail:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=250&fit=crop",
    duration: "38:22",
    price: 25,
    isLocked: true,
    description:
      "Advanced techniques and methods for contemporary dance, from basic movements to complex choreography.",
  },
  {
    id: "3",
    title: "Building Your Dance Career from Scratch",
    thumbnail:
      "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=250&fit=crop",
    duration: "52:18",
    price: 45,
    isLocked: true,
    description:
      "Essential strategies for building a successful dance career, including networking, auditions, and business skills.",
  },
  {
    id: "4",
    title: "Mental Health for Professional Dancers",
    thumbnail:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    duration: "29:45",
    price: 20,
    isLocked: true,
    description:
      "Understanding and maintaining mental wellness as a professional dancer in a competitive industry.",
  },
  {
    id: "5",
    title: "Dance Studio Business Management",
    thumbnail:
      "https://images.unsplash.com/photo-1594736797933-d0301ba2fe65?w=400&h=250&fit=crop",
    duration: "41:33",
    price: 35,
    isLocked: true,
    description:
      "Complete guide to running a successful dance studio, from operations to marketing and finance.",
  },
  {
    id: "6",
    title: "International Dance Competitions Guide",
    thumbnail:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
    duration: "36:12",
    price: 28,
    isLocked: true,
    description:
      "Navigate the world of international dance competitions with expert tips and insider knowledge.",
  },
];

export const moderators = [
  {
    id: "1",
    name: "Grund jhay",
    email: "officialgrund@gmail.com",
    status: "pending",
    initials: "GJ",
  },
];

export const user = {
  name: "beyonce",
  username: "beyonceknowle",
  profileImage:
    "https://images.unsplash.com/photo-1494790108755-2616c2e8e0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
  verified: true,
  communities: [
    {
      id: "1",
      memberCount: 456,
      name: "Y Combinator",
      profileImage: images.Xcomm4, // ✅
      memberImages: [
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      ],
    },
    {
      id: "2",
      memberCount: 512,
      name: "A16z",
      profileImage: images.Xcomm6, // 👈 was `image`
      memberImages: [
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
        "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      ],
    },
    {
      id: "3",
      memberCount: 389,
      name: "Acquired",
      profileImage: images.Xcomm5, // 👈 was `image`
      memberImages: [
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
        "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
        "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      ],
    },
  ],
};
export const videoComments: VideoComment[] = [
  {
    id: "1",
    thumbnail:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop&q=80",
    posterUri:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1200&fit=crop&q=80",
    videoUri:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1080&h=1920&fit=crop&q=80",
    likes: 3400,
    comments: 156,
    description: "New season, new slay! 🔥 Whether it's street style...",
    user: {
      name: "sarah_smith",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    replyingTo: {
      name: "john_doe",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  },
  {
    id: "2",
    thumbnail:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&q=80",
    posterUri:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1200&fit=crop&q=80",
    videoUri:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1080&h=1920&fit=crop&q=80",
    likes: 3100,
    comments: 89,
    description: "Couple goals ✨ spreading joy together.",
    user: {
      name: "mike_johnson",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    replyingTo: {
      name: "sarah_smith",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  },
  {
    id: "3",
    thumbnail:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=600&fit=crop&q=80",
    posterUri:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=1200&fit=crop&q=80",
    videoUri:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1080&h=1920&fit=crop&q=80",
    likes: 2800,
    comments: 120,
    description: "Nature vibes 🌿 living the moment.",
    user: {
      name: "lisa_brown",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    replyingTo: {
      name: "mike_johnson",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
  },
  {
    id: "4",
    thumbnail:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=600&fit=crop&q=80",
    posterUri:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&h=1200&fit=crop&q=80",
    videoUri:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=1080&h=1920&fit=crop&q=80",
    likes: 4500,
    comments: 210,
    description: "Squad energy 💯 nothing beats friendship.",
    user: {
      name: "groupie_gang",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    replyingTo: {
      name: "lisa_brown",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
  },
  {
    id: "5",
    thumbnail:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=600&fit=crop&q=80",
    posterUri:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=1200&fit=crop&q=80",
    videoUri:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1080&h=1920&fit=crop&q=80",
    likes: 1900,
    comments: 74,
    description: "Food is love ❤️ comfort on a plate.",
    user: {
      name: "foodie_queen",
      avatar: "https://randomuser.me/api/portraits/women/14.jpg",
    },
    replyingTo: {
      name: "groupie_gang",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    },
  },
  {
    id: "6",
    thumbnail:
      "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=400&h=600&fit=crop&q=80",
    posterUri:
      "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=800&h=1200&fit=crop&q=80",
    videoUri:
      "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=1080&h=1920&fit=crop&q=80",
    likes: 3600,
    comments: 98,
    description: "Eyes tell a thousand stories 👀.",
    user: {
      name: "james_clark",
      avatar: "https://randomuser.me/api/portraits/men/36.jpg",
    },
    replyingTo: {
      name: "foodie_queen",
      avatar: "https://randomuser.me/api/portraits/women/14.jpg",
    },
  },
  {
    id: "7",
    thumbnail:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop&q=80",
    posterUri:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1200&fit=crop&q=80",
    videoUri:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1080&h=1920&fit=crop&q=80",
    likes: 2200,
    comments: 64,
    description: "Laughter is contagious 😂✨.",
    user: {
      name: "laughing_lucy",
      avatar: "https://randomuser.me/api/portraits/women/21.jpg",
    },
    replyingTo: {
      name: "james_clark",
      avatar: "https://randomuser.me/api/portraits/men/36.jpg",
    },
  },
  {
    id: "8",
    thumbnail:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&q=80",
    posterUri:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1200&fit=crop&q=80",
    videoUri:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1080&h=1920&fit=crop&q=80",
    likes: 5100,
    comments: 342,
    description: "Streetwear season 🖤 keep it bold.",
    user: {
      name: "style_master",
      avatar: "https://randomuser.me/api/portraits/men/51.jpg",
    },
    replyingTo: {
      name: "laughing_lucy",
      avatar: "https://randomuser.me/api/portraits/women/21.jpg",
    },
  },
  {
    id: "9",
    thumbnail:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop&q=80",
    posterUri:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1200&fit=crop&q=80",
    videoUri:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1080&h=1920&fit=crop&q=80",
    likes: 3900,
    comments: 201,
    description: "Daily hustle, daily shine 💪.",
    user: {
      name: "grace_hopper",
      avatar: "https://randomuser.me/api/portraits/women/19.jpg",
    },
    replyingTo: {
      name: "style_master",
      avatar: "https://randomuser.me/api/portraits/men/51.jpg",
    },
  },
  {
    id: "10",
    thumbnail:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=600&fit=crop&q=80",
    posterUri:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&h=1200&fit=crop&q=80",
    videoUri:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1080&h=1920&fit=crop&q=80",
    likes: 4000,
    comments: 110,
    description: "Confidence is the best outfit 👗.",
    user: {
      name: "sophia_turner",
      avatar: "https://randomuser.me/api/portraits/women/67.jpg",
    },
    replyingTo: {
      name: "grace_hopper",
      avatar: "https://randomuser.me/api/portraits/women/19.jpg",
    },
  },
  {
    id: "11",
    thumbnail:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&q=80",
    posterUri:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1200&fit=crop&q=80",
    videoUri:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1080&h=1920&fit=crop&q=80",
    likes: 6200,
    comments: 540,
    description: "Joy shared is joy multiplied 🎉.",
    user: {
      name: "party_people",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    },
    replyingTo: {
      name: "sophia_turner",
      avatar: "https://randomuser.me/api/portraits/women/67.jpg",
    },
  },
  {
    id: "12",
    thumbnail:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&q=80",
    posterUri:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1200&fit=crop&q=80",
    videoUri:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1080&h=1920&fit=crop&q=80",
    likes: 2700,
    comments: 97,
    description: "Choose happiness every day ☀️.",
    user: {
      name: "emma_watson",
      avatar: "https://randomuser.me/api/portraits/women/24.jpg",
    },
    replyingTo: {
      name: "party_people",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    },
  },
];

export const textComments = [
  {
    id: "1",
    author: {
      name: "Jhayjameson",
      username: "@Jhayjameson",
      profileImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
    },
    content:
      'New season, new slay! 🔥 Whether it\'s street style, high fashion, or effortless chic, your outfit should always tell a story. 💅✨ Today, I\'m serving "bold neutrals with a pop of color" or "classic elegance with a modern twist"], because confidence is the best accessory! 👑',
    timestamp: "2h",
    likes: 2678,
    replies: 653,
  },
  {
    id: "2",
    author: {
      name: "Jhayjameson",
      username: "@Jhayjameson",
      profileImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
    },
    content:
      'New season, new slay! 🔥 Whether it\'s street style, high fashion, or effortless chic, your outfit should always tell a story. 💅✨ Today, I\'m serving "bold neutrals with a pop of color" or "classic elegance with a modern twist"], because confidence is the best accessory! 👑',
    timestamp: "2h",
    likes: 2678,
    replies: 653,
  },
];

export const MOCK_USER = {
  name: "Marysnyder_",
  avatar: "https://randomuser.me/api/portraits/women/1.jpg",
};
export const MOCK_REPLY_TO = {
  name: "Stella martins",
  avatar: "https://randomuser.me/api/portraits/women/2.jpg",
};
export const MOCK_POSTER =
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=687&q=80";

export const categories: Category[] = [
  {
    id: 1,
    name: "Food",
    img: images.cat1,
  },
  {
    id: 2,
    name: "Entertainment",
    img: images.cat2,
  },
  {
    id: 3,
    name: "Comedy",
    img: images.cat3,
  },
  {
    id: 4,
    name: "Food",
    img: images.cat4,
  },
  {
    id: 5,
    name: "Entertainment",
    img: images.cat5,
  },
  {
    id: 6,
    name: "Comedy",
    img: images.cat6,
  },
  {
    id: 7,
    name: "Food",
    img: images.cat7,
  },
  {
    id: 8,
    name: "Entertainment",
    img: images.cat8,
  },
  {
    id: 9,
    name: "Comedy",
    img: images.cat9,
  },
  { id: 10, name: "Food", img: images.cat10 },
  { id: 11, name: "Entertainment", img: images.cat11 },
  { id: 12, name: "Comedy", img: images.cat12 },
  { id: 13, name: "Food", img: images.cat13 },
  { id: 14, name: "Entertainment", img: images.cat14 },
  { id: 15, name: "Comedy", img: images.cat15 },
  { id: 16, name: "Food", img: images.cat16 },
  { id: 17, name: "Entertainment", img: images.cat17 },
  { id: 18, name: "Comedy", img: images.cat18 },
  { id: 19, name: "Food", img: images.cat19 },
  { id: 20, name: "Entertainment", img: images.cat20 },
];

// Example data you can use in your screen/component
export const DUMMY_STORIES = [
  {
    id: 1,
    name: "Richard",
    avatar: "https://i.pravatar.cc/150?u=richard",
    items: [
      {
        id: 1,
        uri: "https://res.cloudinary.com/dddc4rjme/image/upload/v1760441046/story_vz9kep.jpg",
        caption: "Morning Hike Views 🏔️",
      },
      {
        id: 2,
        uri: "https://picsum.photos/id/11/1080/1920",
        caption: "Coffee Time",
      },
    ],
  },
  {
    id: 2,
    name: "Beyonce",
    avatar: "https://i.pravatar.cc/150?u=beyonce",
    items: [
      {
        id: 1,
        uri: "https://res.cloudinary.com/dddc4rjme/image/upload/v1760441046/story_vz9kep.jpg",
        caption: "Todays outfit check",
      },
      {
        id: 2,
        uri: "https://picsum.photos/id/21/1080/1920",
        caption: "Studio Vibes ✨",
      },
      { id: 3, uri: "https://picsum.photos/id/22/1080/1920" },
    ],
  },
  {
    id: 3,
    name: "Storm",
    avatar: "https://i.pravatar.cc/150?u=storm",
    items: [
      {
        id: 1,
        uri: "https://res.cloudinary.com/dddc4rjme/image/upload/v1760441046/story_vz9kep.jpg",
        caption: "City Lights",
      },
    ],
  },
  {
    id: 4,
    name: "Storm",
    avatar: "https://i.pravatar.cc/150?u=storm",
    items: [
      {
        id: 1,
        uri: "https://res.cloudinary.com/dddc4rjme/image/upload/v1760441046/story_vz9kep.jpg",
        caption: "City Lights",
      },
      {
        id: 2,
        uri: "https://picsum.photos/id/30/1080/1920",
        caption: "City Lights",
      },
    ],
  },
  {
    id: 5,
    name: "Storm",
    avatar: "https://i.pravatar.cc/150?u=storm",
    items: [
      {
        id: 1,
        uri: "https://res.cloudinary.com/dddc4rjme/image/upload/v1760441046/story_vz9kep.jpg",
        caption: "City Lights",
      },
      {
        id: 2,
        uri: "https://picsum.photos/id/30/1080/1920",
        caption: "City Lights",
      },
    ],
  },
  {
    id: 6,
    name: "Storm",
    avatar: "https://i.pravatar.cc/150?u=storm",
    items: [
      {
        id: 1,
        uri: "https://picsum.photos/id/30/1080/1920",
        caption: "City Lights",
      },
    ],
  },
  {
    id: 7,
    name: "Storm",
    avatar: "https://i.pravatar.cc/150?u=storm",
    items: [
      {
        id: 1,
        uri: "https://picsum.photos/id/30/1080/1920",
        caption: "City Lights",
      },
    ],
  },
  {
    id: 8,
    name: "Storm",
    avatar: "https://i.pravatar.cc/150?u=storm",
    items: [
      {
        id: 1,
        uri: "https://picsum.photos/id/30/1080/1920",
        caption: "City Lights",
      },
    ],
  },
  {
    id: 9,
    name: "Storm",
    avatar: "https://i.pravatar.cc/150?u=storm",
    items: [
      {
        id: 1,
        uri: "https://picsum.photos/id/30/1080/1920",
        caption: "City Lights",
      },
    ],
  },
  {
    id: 10,
    name: "Storm",
    avatar: "https://i.pravatar.cc/150?u=storm",
    items: [
      {
        id: 1,
        uri: "https://picsum.photos/id/30/1080/1920",
        caption: "City Lights",
      },
    ],
  },
  {
    id: 11,
    name: "Storm",
    avatar: "https://i.pravatar.cc/150?u=storm",
    items: [
      {
        id: 1,
        uri: "https://picsum.photos/id/30/1080/1920",
        caption: "City Lights",
      },
    ],
  },
  {
    id: 12,
    name: "Storm",
    avatar: "https://i.pravatar.cc/150?u=storm",
    items: [
      {
        id: 1,
        uri: "https://picsum.photos/id/30/1080/1920",
        caption: "City Lights",
      },
    ],
  },
  {
    id: 13,
    name: "Storm",
    avatar: "https://i.pravatar.cc/150?u=storm",
    items: [
      {
        id: 1,
        uri: "https://picsum.photos/id/30/1080/1920",
        caption: "City Lights",
      },
    ],
  },
  {
    id: 14,
    name: "Storm",
    avatar: "https://i.pravatar.cc/150?u=storm",
    items: [
      {
        id: 1,
        uri: "https://picsum.photos/id/30/1080/1920",
        caption: "City Lights",
      },
    ],
  },
];
