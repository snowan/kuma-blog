# 第一章 — 可靠性，可扩展性，可维护性的应用程序(Reliable, Scalable, and Maintainable Applications)

| The Internet was done so well that most people think of it as a natural resource like the Pacific Ocean, rather than something that was man-made. When was the last time a technology with a scale like that was so error-free?
| —Alan Kay, in interview with Dr Dobb’s Journal (2012)


现今很多应用程序都是数据密集型（data-intensive），跟计算密集型（compute-intensive）相反。原始CPU （raw CPU）基本不能成为这些应用的限制因素 — 更大的问题常常是大量的数据（data）和这些数据改变的速度。

数据密集型应用程序通常由提供常用功能的标准构建块构建。例如，许多应用程序需要：

- 存储数据，所以应用程序本身或者其他应用程序可以再次访问存储的数据（数据库（database））
- 记录昂贵操作的结果，以加快读取数据的结果（缓存（caches））
- 允许用户用不同方式以关键字或过滤器搜索数据（搜索索引（search indexes））
- 发送一条信息到另一个要异步处理的进程（流处理（stream processing））
- 定期处理大量的累积数据（批处理（batch processing））

如果这听起来很痛苦，那仅仅是因为这些数据系统是如此成功的抽象：我们一直都在不加思索的使用他们。当构建一个应用程序的时候，大部分程序员不会想着重头开始写一个新的数据存储引擎，因为数据库是完成这项工作的非常完美的工具。

其实现实并不是那样简单。有许多具有不同特性的数据库系统，因为不同的应用程序具有不同的要求。有很多不同的方法处理缓存，不同的方式创建搜索索引，等等。当创建一个应用程序时，我们仍然需要找出最适合手头工作的工具和方法。当一个工具不能单独完成项目时，组合工具可能变得很难。

本书是对数据系统的原理和实用性以及如何使用它们来构建数据密集型应用程序的一次旅程。 我们将探讨不同工具的共同点，它们的区别以及如何实现其特性。

在本章中，我们将从探索我们要实现的基础知识开始：可靠，可扩展和可维护的数据系统。 我们将弄清这些含义是什么，概述一些思考方法，并讲解后面几章中所需要的基础。 在以下各章中，我们将逐层继续，研究在处理数据密集型应用程序时需要考虑的不同设计决策。

##


