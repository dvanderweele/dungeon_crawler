# *WIP: Dungeon Crawler*

*A procedural nystrom dungeon generator and crawler built with **Kaboom.js**.* 

## What's a *"Nystrom Dungeon"*?

That's just what I call it. [See Bob Nystrom's original article for more in-depth information.](http://journal.stuffwithstuff.com/2014/12/21/rooms-and-mazes/)

I probably implemented the algorithm a bit differently than him, but the high-level overview is:

1. Given a capped number of tries, keep trying to carve rooms out of a grid of cells.
2. Carve out the gaps between the rooms with a maze *à la* recursive backtracking (actually not recursive, I use a stack).
3. Carved one or more doorways for each room (to connect each room to the maze).
4. Trim the deadends off the maze to make it less annoying for humans.

## Project Architecture

⚒️ **Primary Tools**

* Pixel Studio on Android
* Firefox (or sometimes Chrome) on Android
* Termux on Android (F-Droid Version)
    * Neovim w/ coc-eslint (because devtools aren't on mobile...😭)
    * Node.js v14.15.4
        * Kaboom.js ^0.5.1
        * Webpack

📱 **Why... Android?**

Termux is actually pretty charming. That being said it's mostly just because it's most convenient for me to work on side projects on mobile at the moment rather than desktop/laptop.

🗂️**Diectory Structure**

Pretty standard webpack project layout with `dist`, `src`, and `node_modules` in project root. *The magic happens inside `src`.*

I have much of the contents of `src` divvied up into subdirectories in order to separate entities (what kaboom calls objects), components, assets, and scenes.

## Why Webpack?

Welp...

It's the **Kleenex®** brand of JavaScript bundlers. 

There are plenty of other bundlers out there touting "less config" than webpack, but as it turns out **none of them** *(at the time of this writing)* **work well or at all in Termux**. Actually, I borked my Termux install trying to get them to work 😤. 

In the end, I realized that it was an enormous effort to go through to avoid learning how to do a basic webpack config. So I read through the docs — which are actually **amazing** — and it left me wondering why anyone ever complains about it. 
