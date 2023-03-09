# Assignment 2

This is the second obligatory assignment in the course IDATT2104 Network Programming.

The assignment was to create the 'Workers' class as shown in the code block below. Further requirements was to:
- Use condition variable
- The post()-methods should be thread-safe (can be used without problem in multiple threads simultaneously).
- Use a language free of choice, but not Python. Java, C++ and Rust were recommended, so I chose C++ as I did the last assignment.
- Add a stop()-method that stops the threads when the list of tasks is empty.
- Add a post_timeout()-method that runs the task argument after a given amount of milliseconds.

```
Workers worker_threads(4);
Workers event_loop(1);

worker_threads.start(); // Create 4 internal threads
event_loop.start(); // Create 1 internal thread

worker_threads.post([] {
  // Task A
});

worker_threads.post([] {
  // Task B
  // Might run in parallel with task A
});

event_loop.post([] {
  // Task C
  // Might run in parallel with task A and B
});

event_loop.post([] {
  // Task D
  // Will run after task C
  // Might run in parallel with task A and B
});

worker_threads.join(); // Calls join() on the worker threads
event_loop.join(); // Calls join() on the event thread
```
