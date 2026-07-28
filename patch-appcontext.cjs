const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const profileOld1 = `  const [profile, setProfile] = useState<UserProfile>({
    favoriteCuisines: [],
    skillLevel: 'Intermediate',
    maxCookingTime: 60,
    hasCompletedOnboarding: false,
  });`;

const profileNew1 = `  const [profile, setProfile] = useState<UserProfile>({
    favoriteCuisines: [],
    hasCompletedOnboarding: false,
  });`;

content = content.replace(profileOld1, profileNew1);

const profileOld2 = `      setProfile({
        favoriteCuisines: [],
        skillLevel: 'Intermediate',
        maxCookingTime: 60,
        hasCompletedOnboarding: false,
      });`;

const profileNew2 = `      setProfile({
        favoriteCuisines: [],
        hasCompletedOnboarding: false,
      });`;

content = content.replace(profileOld2, profileNew2);

const dbProfileOld = `          const next = {
            email: data.email || auth.currentUser?.email || undefined,
            favoriteCuisines: data.favoriteCuisines || [],
            healthConditions: data.healthConditions || [],
            skillLevel: data.skillLevel || 'Intermediate',
            maxCookingTime: data.maxCookingTime || 60,
            hasCompletedOnboarding: data.hasCompletedOnboarding || false,
            selectedGroupId: data.selectedGroupId,
            notifications: data.notifications,
            raceType: data.raceType,
            raceDate: data.raceDate,
            weeklyTrainingDays: data.weeklyTrainingDays,
          };`;

const dbProfileNew = `          const next = {
            email: data.email || auth.currentUser?.email || undefined,
            favoriteCuisines: data.favoriteCuisines || [],
            healthConditions: data.healthConditions || [],
            hasCompletedOnboarding: data.hasCompletedOnboarding || false,
            selectedGroupId: data.selectedGroupId,
            notifications: data.notifications,
          };`;

content = content.replace(dbProfileOld, dbProfileNew);

fs.writeFileSync('src/context/AppContext.tsx', content);
