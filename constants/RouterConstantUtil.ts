export const RouterConstantUtil = {
  tabs: {
    home: "/(tabs)/home",
    group: "/(tabs)/group",
    profile: "/(tabs)/profile",
    search: "/(tabs)/search",
    exclusiveContent: "/(tabs)/exclusiveContent",
  },

  profile: {
    email: "/(profile)/change-email",
    username: "/(profile)/change-username",
    communities: "/(profile)/user-communities",
    subscriptioninfo: "/(profile)/subscription-info",
    settings: "/(profile)/settings",
    changepassword: "/(profile)/change-password",
    termsofuse: "/(profile)/termsofuse",
    helpdesk: "/(profile)/helpdesk",
    privacy: "/(profile)/privacy",
    notifications: "/(profile)/notifications",
    tags: "/(profile)/tags",
  },
  discover: {
    podcats: "/(discover)/podcasts",
    videoReply: "/(discover)/video-reply",
  },
  makepost: {
    start: "/(makepost)/create-post-startup",
  },
  community: {
    start: "/(community)/create-community-startup",
    create: "/(community)/create-community",
    manage: "/(community)/manage-community",
    user: "/(community)/user-view-community",
  },
  museai: {
    communitychat: "/(museai)/community-chat",
  },

  auth: {
    login: "/(auth)",
    register: "/(auth)",
  },
} as const; // 👈 THIS is the magic
