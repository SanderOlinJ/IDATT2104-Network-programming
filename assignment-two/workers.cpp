#include "workers.h"
#include <chrono>
#include <iostream>
#include <utility>

Workers::Workers(int numOfThreads){
    this->numOfThreads = numOfThreads;
}

Workers::~Workers() {
    cout << "Worker destructed" << endl;
}

void Workers::start() {
    for (int i = 0; i < numOfThreads; i++) {
        workerThreads.emplace_back([&] {
            while (true){
                function<void()> task;
                {
                    unique_lock<mutex> lock(tasks_mutex);
                    cv.wait(lock, [this] {
                        return !tasks.empty() || quit;
                    });

                    if (quit){
                        return;
                    }
                    task = *tasks.begin();
                    tasks.pop_front();
                }
                task();
            }
        });
    }
}

void Workers::post(const function<void()>& task) {
    {
        unique_lock<mutex> lock(tasks_mutex);
        tasks.emplace_back(task);
    }
    cv.notify_all();
}

void Workers::join() {
    {
        unique_lock<mutex> lock(tasks_mutex);
        quit.exchange(true);
    }
    cv.notify_all();
    for (auto& thread : workerThreads) {
        thread.join();
    }
    workerThreads.clear();
}

void Workers::post_timeout(const function<void()>& task, int ms) {
    this_thread::sleep_for(chrono::milliseconds(ms));
    this->post(task);
}