---
title: "Building the Agentic Contextualizer: Better Context for AI Agents"
date: "2025-11-22"
excerpt: "Why I'm building a tool to generate optimized context for AI agents, and the balance between cost, efficiency, and 'smart' analysis."
coverImage: "/images/blog/agentic-contextualizer.jpg"
tags: ["ai", "agents", "context-engineering", "python"]
githubUrl: "https://github.com/balorette/agentic-contextualizer"
status: "in-progress"
featured: true
published: true
---

## Building the Agentic Contextualizer: Better Context for AI Agents

I generally am not the best at naming things, which is how we ended up with **Agentic Contextualizer**.

When considering Software and AI, so many different topics come up. Recently, I’ve been focused on the best architectures to leverage it (Microservices... *cough*) and the actual use cases for it.

AI came onto the scene at speed, and its continued pace has presented plenty of opportunities. Often, though, many find themselves in the trap of looking for a problem to fit the solution.

In general, software is already situated as an efficient way to solve complex problems. Yes, I know that only holds true when built right, but I would honestly argue that even when built inefficiently, traditional software often beats out other methods.

AI—specifically Agentic AI—has the potential to improve that efficiency. However, it also has just as much ability to go in the opposite direction. The best illustration of this is one commonly used when teaching algorithms: **Sort**. To keep this statement straightforward and to the point: it is easier, cheaper, and faster to call `list.sort()` than it is to say "LLM, please sort this for me."

As I work on projects and do my own learning, finding these lines can get tricky, especially as solutions become complex. Still, it is something to keep an eye out for. Once a problem is encountered and the AI Agentic framework is found to be a viable solution, more considerations come into play—like cost and context. This is the foundation of my most recent undertaking.

## The Problem: Context is King

I want my Agents, Copilots, and AI Assistants to have the best context when helping me with a problem.

GitHub serves a purpose for me far beyond just housing the code I write. I use repos to house thoughts, projects (even where there is no code), or just generally organize my work. GenAI can really supercharge me when I work this way by helping me formalize thoughts and plans. Opening up a chat in relation to a repo does a great job when I am looking at specific things, but more and more I am needing to work across many of my repos to do something.

Solutions like **Context7** (and similar MCP tools) do this amazingly for coding agents at times, but what about when it's more specific? I don't want or need to fine-tune a model for something specific to me. With things like Claude Projects or ChatGPT, you can provide context files and store them. But what if I wanted something more akin to a dedicated context builder?

Step one meant I really needed to build out a **Contextualizer**. At face value, I thought this project would be super simple. As I thought on it and architected it, I found more lying in wait for me:

- How do I build the context?
- How do I deal with multiple types of projects that I want context from?
- How do I afford this without a massive bill?

Here are some of the things I have found as I build this. I am sure this list will continue to grow as the project does too.

## Context Everywhere

If you haven't dug into context engineering, I highly recommend it. Anthropic covered it well here: [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents).

What is fun with this is that you have to consider context on two separate fronts. The obvious one is the **output context** I hope to give to my other agents when needed. This should be an effective context that doesn't needlessly eat up tokens. Too small, and it could be entirely useless.

The other context is the **input context** for my agents in the solution itself. Currently, I am doing a simple chain with the option for Human-in-the-loop refinement. First, I discover the desired repository, putting together the files and general information that will form the analysis context. This will all then form the context builder's context. If this gets too unruly, it will either be super expensive or... not generate anything useful.

I can't express enough how good that Anthropic article is for understanding the "Goldilocks Zone" for Context.

## LLMs Come At A Cost

I say this in terms of actual monetary considerations, but also in performance. "Sort" is a cheap shot to take, but this project highlighted for me some of the finer points.

Let's say I knew a lot about the context I was going to have built. I could write my functions to simply pull files, look in the areas I know it should look at, and even give it templates and boilerplate to use in generating the context. On the opposite side, if I knew nothing, I could simply say "Hey agent, scan this repo and tell me what I need to know."

Both approaches are valid. Both, however, find issues in scale. More so, the one that is basically hard-coded but just handing something to an LLM means you are not going to get the best results.

Finding a balance here turns into a consideration of degrees. In the project's current state, it's on the simple side: letting the user provide a repository and summary, then using traditional methods (scanning file trees, reading `README.md`) to build a general grasp of the codebase. Now we can have the LLM act in a more focused manner.

As this grows and I need to consider things like different sources or complex context requirements, my approach is going to continue to have to find the balance between **expensive vs. efficient**. Coding languages are a fun one to think about. Leveraging LSP (Language Server Protocol) will be a great way to find that balance versus just simply saying: "Hey, Claude, do this."

One big thing, though, is to recognize you won't know until you do. So find something and build it!


