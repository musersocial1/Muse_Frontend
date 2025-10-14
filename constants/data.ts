import { LongFormContent, Post } from "@/types/community";
import { Category } from "@/types/discover";
import { VideoComment } from "@/types/post";
import { images } from "./images";

export const dummyAllPosts: Post[] = [
  {
    id: "1",
    author: {
      name: "Sarah Chen",
      username: "sarahc_tech",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      verified: true,
    },
    images: [images.mainpost1],
    content:
      "Friedberg should have his own podcast, along with Chamath ... and Sacks. hm.. What am I trying to say here?",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: images.post1,
      },
      {
        type: "image",
        url: images.post2,
      },
      {
        type: "image",
        url: images.post3,
      },
      {
        type: "image",
        url: images.post4,
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
      name: "Marcus Johnson",
      username: "marcusj_dev",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      verified: false,
    },
    images: [images.mainpost2],
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
        url: images.post1,
      },
      {
        type: "image",
        url: images.post2,
      },
      {
        type: "image",
        url: images.post3,
      },
      {
        type: "image",
        url: images.post4,
      },
    ],
  },
  {
    id: "3",
    author: {
      name: "Elena Rodriguez",
      username: "elena_writes",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      verified: true,
    },
    images: [images.mainpost3],
    content:
      "Would Elon Musk have been able to do his first start up if there was a $100k fee for H1-B? Elon promised to go to war over H1-B but I don't think he has said anything about the new rules.",
    timestamp: "1h",
    likes: 3421,
    thumbnail: images.latest2,
    comments: 567,
    type: "image",
  },
  {
    id: "4",
    author: {
      name: "David Kim",
      username: "davidk_startup",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
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
        url: images.post1,
      },
      {
        type: "image",
        url: images.post2,
      },
      {
        type: "image",
        url: images.post3,
      },
      {
        type: "image",
        url: images.post4,
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
      name: "Alex Thompson",
      username: "alexthompson",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
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
        url: images.post1,
      },
      {
        type: "image",
        url: images.post2,
      },
      {
        type: "image",
        url: images.post3,
      },
      {
        type: "image",
        url: images.post4,
      },
    ],
  },
  {
    id: "6",
    communityName: "Chef Valentina",
    author: {
      name: "Isabella Martinez",
      username: "chef_bella",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      verified: true,
    },
    content: "Be honest, what's the best drink for this meal ?",
    images: [images.mainpost6],
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
        url: images.post1,
      },
      {
        type: "image",
        url: images.post2,
      },
      {
        type: "image",
        url: images.post3,
      },
      {
        type: "image",
        url: images.post4,
      },
    ],
  },
  {
    id: "7",
    communityName: "Mentors united",
    author: {
      name: "James Wilson",
      username: "jameswilson_mentor",
      avatar:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face",
      verified: false,
    },
    images: [images.mainpost7],
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
        url: images.post1,
      },
      {
        type: "image",
        url: images.post2,
      },
      {
        type: "image",
        url: images.post3,
      },
      {
        type: "image",
        url: images.post4,
      },
    ],
  },
  {
    id: "8",
    communityName: "Tesla Super Owners",
    author: {
      name: "Ryan Parker",
      username: "ryanp_tesla",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
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
        url: images.post1,
      },
      {
        type: "image",
        url: images.post2,
      },
      {
        type: "image",
        url: images.post3,
      },
      {
        type: "image",
        url: images.post4,
      },
    ],
  },
  {
    id: "9",
    communityName: "Tesla Super Owners",
    author: {
      name: "Sophia Lee",
      username: "sophialee_tech",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
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
        url: images.post1,
      },
      {
        type: "image",
        url: images.post2,
      },
      {
        type: "image",
        url: images.post3,
      },
      {
        type: "image",
        url: images.post4,
      },
    ],
  },
  {
    id: "10",
    author: {
      name: "Priya Patel",
      username: "priya_immigrant",
      avatar:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face",
      verified: false,
    },
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
        url: images.post1,
      },
      {
        type: "image",
        url: images.post2,
      },
      {
        type: "image",
        url: images.post3,
      },
      {
        type: "image",
        url: images.post4,
      },
    ],
    likes: 1234,
    comments: 445,
    type: "text",
  },
  {
    id: "11",
    author: {
      name: "Michael Roberts",
      username: "mikeroberts_media",
      avatar:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
      verified: true,
    },
    content:
      "Last week Chamath and Sacks say no one watches Kimmel and cited his poor ratings but this week say Kimmel was the leading voice? How does that math make sense if no one watches him? Let's try to stay consistent here.",
    timestamp: "5h",
    likes: 2890,
    comments: 678,
    type: "text",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: images.post1,
      },
      {
        type: "image",
        url: images.post2,
      },
      {
        type: "image",
        url: images.post3,
      },
      {
        type: "image",
        url: images.post4,
      },
    ],
  },
  {
    id: "12",
    author: {
      name: "Jennifer Chang",
      username: "jenchang_policy",
      avatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
      verified: false,
    },
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
        url: images.post1,
      },
      {
        type: "image",
        url: images.post2,
      },
      {
        type: "image",
        url: images.post3,
      },
      {
        type: "image",
        url: images.post4,
      },
    ],
    likes: 1567,
    comments: 289,
    type: "text",
  },
  {
    id: "13",
    author: {
      name: "Carlos Mendez",
      username: "carlosm_business",
      avatar:
        "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face",
      verified: true,
    },
    content:
      "Thank you for exposing the abusive practices by Wipro, Infosys, HCLTech and Cognizant. Don't forget how big US companies leverage them with a two-tiered contractor system allowing zero notice terminations.",
    timestamp: "7h",
    likes: 3245,
    comments: 567,
    type: "text",
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: images.post1,
      },
      {
        type: "image",
        url: images.post2,
      },
      {
        type: "image",
        url: images.post3,
      },
      {
        type: "image",
        url: images.post4,
      },
    ],
  },
  {
    id: "14",
    author: {
      name: "Amanda Foster",
      username: "amandaf_observer",
      avatar:
        "https://images.unsplash.com/photo-1464863979621-258859e62245?w=100&h=100&fit=crop&crop=face",
      verified: false,
    },
    content:
      'I like how these guys said they dont do ads on the pod, but every episode starts with a subtle "commentary ad" about a brand or product. Today was Emirates Airlines. You can fool everyone, but not me! Still a smart move though!',
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: images.post1,
      },
      {
        type: "image",
        url: images.post2,
      },
      {
        type: "image",
        url: images.post3,
      },
      {
        type: "image",
        url: images.post4,
      },
    ],
    timestamp: "2h",
    likes: 1456,
    comments: 234,
    type: "text",
  },
  {
    id: "15",
    author: {
      name: "Taylor Swift",
      username: "taylorswift13",
      avatar:
        "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=100&h=100&fit=crop&crop=face",
      verified: true,
    },
    content:
      "New season, new day! Whether it's street style, high fashion, or effortless chic, your outfit should always tell a story. Today I'm serving \"bold neutrals with a pop of color\" because confidence is the best accessory!",
    timestamp: "15m",
    likes: 45678,
    comments: 8923,
    type: "text",
  },
  {
    id: "16",
    author: {
      name: "Raj Sharma",
      username: "rajsharma_analyst",
      avatar:
        "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face",
      verified: true,
    },
    vComments: [
      {
        type: "video",
        url: "https://cubbyproduct.s3.us-east-2.amazonaws.com/hatespeech/How+to+crack+the+Ugc-Net+Exam+in+the+very+first+attempt_.mp4",
      },
      {
        type: "image",
        url: images.post1,
      },
      {
        type: "image",
        url: images.post2,
      },
      {
        type: "image",
        url: images.post3,
      },
      {
        type: "image",
        url: images.post4,
      },
    ],
    content:
      "Sacks hit the nail on the head. If the H-1B fee rises to $100,000 and registrations drop 80%, all 85,000 visas will still be used. The selection rate would jump from 19% to 94%, so I don't see why there's a meltdown over the fee.",
    timestamp: "4h",
    likes: 2789,
    thumbnail: images.latest2,
    comments: 445,
    type: "text",
  },
];

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
      name: "K.Dots community",
      memberCount: 456,
      profileImage:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      memberImages: [
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      ],
    },
    {
      id: "2",
      name: "Creative Minds",
      memberCount: 512,
      profileImage:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      memberImages: [
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
        "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      ],
    },
    {
      id: "3",
      name: "Innovators Hub",
      memberCount: 389,
      profileImage:
        "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
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
