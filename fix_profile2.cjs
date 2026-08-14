const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

code = code.replace(
  "import { Heart, Star, Share, User, Leaf, Ban, X, Target, Users, Plus, ChefHat, Clock, LogOut, Activity, Bell, Calendar, ShoppingCart, Archive, Mail, Sparkles, Check, ChevronDown, ChevronUp } from 'lucide-react';",
  "import { Heart, Star, Share, User, Leaf, Ban, X, Target, Users, Plus, ChefHat, Clock, LogOut, Activity, Bell, Calendar, ShoppingCart, Archive, Mail, Sparkles, Check, ChevronDown, ChevronUp, Settings } from 'lucide-react';"
);

fs.writeFileSync('src/views/ProfileView.tsx', code);
