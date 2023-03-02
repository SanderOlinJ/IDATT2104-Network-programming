#include "workers.h"
#include <iostream>
#include <mutex>

mutex print_safe;

void worker_greeting(thread::id id){
    unique_lock<mutex> lock(print_safe);
    cout << " WORKER greets from thread ID: " << id << endl;
}

void event_greeting(thread::id id){
    unique_lock<mutex> lock(print_safe);
    cout << " EVENT greets from thread ID: " << id << endl;
}

int main() {
    Workers worker_threads(4);
    Workers event_loop(1);

    worker_threads.start();
    event_loop.start();

    worker_threads.post_timeout([] {
        worker_greeting(this_thread::get_id());}
        ,1000);

    worker_threads.post([] {
        worker_greeting(this_thread::get_id());
    });

    event_loop.post([] {
        event_greeting(this_thread::get_id());
    });
    event_loop.post_timeout([] {
        event_greeting(this_thread::get_id());
    }, 2000);

    worker_threads.join();
    event_loop.join();
    return 0;
}