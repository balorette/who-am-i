---
title: "Agentic Contextualizer"
date: "2025-11-22"
excerpt: "Bulding Better Context for AI Agents. Why we need to generate optimized context for AI agents, and the balance between cost, efficiency, and 'smart' analysis."
coverImage: "/images/projects/agentic-contextualizer.png"
tags: ["ai", "agents", "context-engineering", "python"]
githubUrl: "https://github.com/balorette/agentic-contextualizer"
status: "in-progress"
featured: true
published: true
---

## The Quest for Context

AI came onto the scene at speed, presenting plenty of opportunities. Often, though, many find themselves in the trap of looking for a problem to fit the solution.

Traditional software is already an efficient way to solve complex problems. AI—specifically Agentic AI—has the potential to improve that efficiency, but it has just as much ability to destroy it. The best illustration of this is the classic **Sort** algorithm: it is easier, cheaper, and faster to call `list.sort()` than it is to ask an LLM to sort a list.

This balance between traditional efficiency and AI capability is the foundation of the **Agentic Contextualizer**. Once a problem is encountered and the AI Agentic framework is found to be a viable solution, considerations like cost and context become critical.

## The Problem: Context is King

I need my Agents to have the *right* context, not just *more* context.

GitHub serves a purpose for me far beyond just housing code. I use repos to house thoughts, projects, and general organization. GenAI supercharges this workflow by helping me formalize plans, but standard tools struggle to bridge the gap between a raw file tree and the semantic understanding an agent needs.

Solutions like **Context7** (and similar tools using the Model Context Protocol, or MCP) do this well for coding agents, but what about when the need is more specific? I don't want to fine-tune a model. With things like Claude Projects or ChatGPT, you can provide context files, but I wanted a dedicated context builder.

Step one was building a **Contextualizer**. At face value, I thought this project would be simple. As I architected it, I found more lying in wait:

- How do I build the context?
- How do I deal with multiple types of projects that I want context from?
- How do I afford this without a massive bill?

Here are some of the things I have found as I build this. I am sure this list will continue to grow as the project does too.

## Context Everywhere

If you haven't dug into context engineering, I highly recommend Anthropic's guide on [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents).

The challenge here is considering context on two separate fronts:

1.  **Output Context:** The context I give to my other agents. This must be effective without needlessly eating up tokens. Too small, and it's useless; too large, and it's expensive noise.
2.  **Input Context:** The context for the agents building the solution itself.

Currently, I am using a simple chain with Human-in-the-loop refinement. First, I discover the desired repository, aggregating files and information to form the analysis context. This forms the context builder's context. If this gets too unruly, it becomes expensive or fails to generate anything useful. Finding that "Goldilocks Zone" is key.

## LLMs Come At A Cost

I say this in terms of monetary cost, but also performance.

If I knew exactly what context I needed, I could write functions to pull specific files and use templates. If I knew nothing, I could simply say "Hey agent, scan this repo and tell me what I need to know."

Both approaches have issues at scale. Hard-coding limits flexibility; pure LLM scanning is slow and expensive.

Finding a balance is a consideration of degrees. In the project's current state, it's simple: the user provides a repository and summary, and I use traditional methods (scanning file trees, reading `README.md`) to build a general grasp of the codebase. This allows the LLM to act in a focused manner.

As this grows, I need to find the balance between **expensive vs. efficient**. Coding languages are a great example. Leveraging **LSP (Language Server Protocol)** allows us to extract symbol definitions deterministically without spending tokens, reserving the LLM for summarization and high-level analysis.

The future of AI agents isn't just about smarter models, but about smarter data preparation. That is the core of the Agentic Contextualizer.


