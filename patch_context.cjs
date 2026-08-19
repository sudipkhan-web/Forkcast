const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

code = code.replace("collection, doc, onSnapshot, setDoc", "collection, doc, onSnapshot, setDoc, deleteDoc");

code = code.replace("markAllNotificationsAsRead: () => Promise<void>;", "markAllNotificationsAsRead: () => Promise<void>;\n  clearReadNotifications: () => Promise<void>;");

const newFunc = `
  const clearReadNotifications = async () => {
    if (!userId) return;
    try {
      const readNotifs = appNotifications.filter(n => n.read);
      await Promise.all(readNotifs.map(n => 
        deleteDoc(doc(db, \`users/\${userId}/notifications\`, n.id))
      ));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, "notifications", showToast);
    }
  };
`;

code = code.replace(
  "  const markAllNotificationsAsRead = async () => {",
  newFunc + "\n  const markAllNotificationsAsRead = async () => {"
);

code = code.replace(
  "markAllNotificationsAsRead,\n      trainingLogs,",
  "markAllNotificationsAsRead,\n      clearReadNotifications,\n      trainingLogs,"
);

fs.writeFileSync('src/context/AppContext.tsx', code);
