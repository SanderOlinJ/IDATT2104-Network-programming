# Assignment 1

This is the first obligatory assignment in the course IDATT2104 Network Programming.

The assignment was to find all primes between two numbers, given a number of threads.
Further requirements was to:
  - Print out a sorted list of the primes found.
  - Try to give the threads an equal workload.
  - Try to use a language you're not that familiar with (I chose C++).

My solution for solving this, involved three different methods:

- Single threading, just a for-loop from number A to number B.
- Multithreading, using subranges, where the subranges are divided equally based on number of threads.
  - Example (5 threads, range 1-100): Thread 1 (1-20), Thread 2 (21-40), Thread 3 (41-60), Thread 4 (61-80), Thread 5 (81-100)
- Multithreading, using every nth-integer, where each thread are given every nth integer based on number of threads.
  - Example (3 threads, range 1-10): Thread 1 (1,4,7,10), Thread 2 (2,5,8), Thread 3(3,6,9)

The first solution was made just for the purpose of meassuring time compared to the multithreading methods.

The third solution, multithreading with every nth integer, was made when I noticed a difference in workload when the ranges got bigger and involved large numbers
when using the subrange-method. This is because in a range of 1 - 10 000, with 10 threads, the first thread will only receive the range 1-1000, while the last thread 
will receive the range 9001-10 000. This results in a higher workload for the last thread.

Using every nth integer counteracts this as every thread will now get the largest numbers at the end of the range.
