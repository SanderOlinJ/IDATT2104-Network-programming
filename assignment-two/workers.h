# pragma once
# include <functional>
# include <iostream>
# include <list>
# include <mutex>
# include <thread>
# include <vector>
# include <atomic>
# include <condition_variable>

using namespace std;

class Workers{
    public:
        explicit Workers(int numOfThreads);
        ~Workers();
        void start();
        void post(const function<void()>& task);
        void join();
        void post_timeout(const function<void()>& task, int ms);

    private:
        int numOfThreads = 0;
        list<function<void()>> tasks;
        mutex tasks_mutex;
        vector<thread> workerThreads;
        condition_variable cv;
        atomic<bool> quit {false};
};