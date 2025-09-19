# Test Ambiguous Words

This file tests that common English words are not flagged as needing capitalization
unless they're clearly referring to specific products/frameworks.

## Regular usage (should NOT trigger errors)

- I have a notion that this will work fine.
- The spring season is beautiful.
- Let me sketch out an idea quickly.
- We need unity in our team.
- The atom is the smallest unit of matter.
- There was discord among the members.
- Let's zoom in on this issue.
- The asana pose was difficult.
- The obsidian rock is volcanic glass.

## Product/framework context (SHOULD trigger errors if not capitalized)

- The notion api is powerful but Notion is correct.
- Using spring framework requires Spring knowledge.
- The unity engine is great but Unity is better.
- The sketch app is useful but Sketch is proper.
- The atom editor was popular but Atom is correct.
- Join our discord server but Discord is right.
- The zoom meeting starts soon but Zoom is proper.
- Managing tasks in asana project but Asana is correct.
- Store notes in obsidian vault but Obsidian is right.

## Already correct capitalization (should NOT trigger errors)

- The Notion API is well-documented.
- Spring Framework is widely used in Java development.
- Unity Engine powers many games.
- Sketch App is popular among designers.
- Atom Editor has many plugins.
- Our Discord Server has many members.
- The Zoom Meeting will start at 2pm.
- Track work in Asana Project management.
- My Obsidian Vault contains all my notes.

## Edge cases (should NOT trigger errors)

- His notion of justice differs from mine.
- Every spring, we review our goals.
- Can you sketch the diagram?
- We achieved unity through collaboration.
- Split the atom to release energy.
- Avoid discord in the team.
- We need to zoom out to see the bigger picture.
- Practice this asana daily for flexibility.
- The obsidian blade was sharp.