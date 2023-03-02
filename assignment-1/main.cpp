#include <iostream>
#include <list>
#include <thread>
#include <vector>
#include <chrono>

using namespace std;
using namespace std::chrono;

// Method for checking if a number is prime.
bool isPrime(int number){
    if (number == 0 || number == 1) {
        return false;
    }
    for (int i = 2; i <= number / 2; ++i) {
        if (number % i == 0){
            return false;
        }
    }
    return true;
}

// Method for finding primes in a given range.
list<int> findPrimesInRange(int startValue, int endValue){
    list<int> primesFound;
    for (int i = startValue; i <= endValue; i++) {
        if (isPrime(i)) {
            primesFound.emplace_back(i);
        }
    }
    return primesFound;
}

// Method for dividing a range into a given amount of subsets that are as equal as possible.
vector<pair<int, int>> divideRangeIntoSubRanges(const int low, const int high, const int numberOfThreads) {

    vector<pair<int, int>> rangePairs{};
    const int delta = high + 1 - low;
    const int range = delta / numberOfThreads;
    int remainder = delta % numberOfThreads;

    int startIndex = low;
    int endIndex = low + range - 1;

    for (int i = 0; i < numberOfThreads; ++i) {
        if (i < remainder){
            endIndex++;
        }
        rangePairs.emplace_back(startIndex, endIndex);
        startIndex = endIndex + 1;
        endIndex = startIndex + range - 1;
    }
    return rangePairs;
}

// Method for finding primes in a given range with multiple threads.
void findPrimesWithMultipleThreadsUsingSubRanges(int startValue, int endValue, int numberOfThreads, list<int>
&primesFound){

    vector<pair<int, int>> rangePairs = divideRangeIntoSubRanges(startValue, endValue, numberOfThreads);
    vector<thread> threads;
    threads.reserve(numberOfThreads);

    for (int i = 0; i < numberOfThreads; i++){
        threads.emplace_back([i, rangePairs, &primesFound] {
            list<int> newPrimesFound = findPrimesInRange(rangePairs[i].first, rangePairs[i].second);
            primesFound.insert(primesFound.end(), newPrimesFound.begin(), newPrimesFound.end());
        });
    }

    for (auto &thread : threads){
        thread.join();
    }
}



// Method for checking every nth number in a range to see if it is prime.
list<int> findPrimesOfEveryNthInteger(int startValue, int endValue, int threadNumber,
                int numberOfThreads){
    list<int> primesFound;
    for (int i = startValue + threadNumber; i <= endValue; i+=numberOfThreads) {
        if (isPrime(i)){
            primesFound.emplace_back(i);
        }
    }
    return primesFound;
}

//Method for finding primes with multithreading, using a method of giving every thread every nth number.
void findPrimesWithMultipleThreadsUsingEveryNthInteger(int startValue, int endValue, int numberOfThreads,
                                                       list<int> &primesFound){
    vector<thread> threads;
    threads.reserve(numberOfThreads);

    //Threads are created and given the method to findPrimes in a range.
    for (int i = 0; i < numberOfThreads; ++i) {
        threads.emplace_back([ startValue, endValue, i, numberOfThreads, &primesFound] {
            list<int> newPrimesFound = findPrimesOfEveryNthInteger
                    (startValue, endValue, i, numberOfThreads);
            primesFound.insert(primesFound.end(), newPrimesFound.begin(), newPrimesFound.end());
        });
    }

    //Threads are terminated.
    for (auto &thread : threads){
        thread.join();
    }
}


int main() {
    const int startValue = 13;
    const int endValue = 200000;
    const int numberOfThreads = 5;
    list<int> primesFoundWithMultithreadingUsingSubRanges;
    list<int> primesFoundWithSingleThreading;
    list<int> primesFoundWithMultithreadingUsingNthInteger;

    //Multithreading with sub ranges.
    //Starts timer and finds primes, then sorts and finally stops timer.
    high_resolution_clock::time_point startMultipleThreadsSubRanges = high_resolution_clock::now();
    findPrimesWithMultipleThreadsUsingSubRanges(startValue, endValue, numberOfThreads,
                                                primesFoundWithMultithreadingUsingSubRanges);
    primesFoundWithMultithreadingUsingSubRanges.sort();
    high_resolution_clock::time_point stopMultipleThreadsSubRanges = high_resolution_clock::now();


    //Multithreading with nth integer-method.
    //Starts timer and finds primes, then sorts and finally stops timer.
    high_resolution_clock::time_point  startMultipleThreadNthInteger = high_resolution_clock::now();
    findPrimesWithMultipleThreadsUsingEveryNthInteger(startValue, endValue, numberOfThreads,
                                                      primesFoundWithMultithreadingUsingNthInteger);
    primesFoundWithMultithreadingUsingNthInteger.sort();
    high_resolution_clock::time_point  stopMultipleThreadNthInteger = high_resolution_clock::now();


    //Normal single threading.
    //Starts timer and finds primes, doesn't need to sort since it find primes sequentially, then finally stops timer.
    high_resolution_clock::time_point startSingleThread = high_resolution_clock::now();
    primesFoundWithSingleThreading = findPrimesInRange(startValue, endValue);
    high_resolution_clock::time_point stopSingleThread = high_resolution_clock::now();


    //Checks if list are not equal, something must then have gone wrong.
    if (!std::equal(primesFoundWithSingleThreading.begin(),
                    primesFoundWithSingleThreading.end(),
                    primesFoundWithMultithreadingUsingSubRanges.begin(),
                    primesFoundWithMultithreadingUsingSubRanges.end())
                    ||
                    !std::equal(primesFoundWithSingleThreading.begin(),
                                   primesFoundWithSingleThreading.end(),
                                   primesFoundWithMultithreadingUsingNthInteger.begin(),
                                   primesFoundWithMultithreadingUsingNthInteger.end())){
        cout << "List are not equal" << endl;
        cout << primesFoundWithSingleThreading.size() << endl;
        cout << primesFoundWithMultithreadingUsingSubRanges.size() << endl;
        cout << primesFoundWithMultithreadingUsingNthInteger.size() << endl;
    }

    //Prints out the time it took for the different methods of prime searching.
    duration<double> timeSingleThreading = duration_cast<duration<double>>(
            stopSingleThread - startSingleThread);
    duration<double> timeMultithreadingSubRanges = duration_cast<duration<double>>(
            stopMultipleThreadsSubRanges - startMultipleThreadsSubRanges);
    duration<double> timeMultithreadingNthInteger = duration_cast<duration<double>>(
            stopMultipleThreadNthInteger - startMultipleThreadNthInteger);

    cout << "Time for single threading: " << timeSingleThreading.count() << endl;
    cout << "Time for multithreading with sub ranges: " << timeMultithreadingSubRanges.count() << endl;
    cout << "Time for multithreading with nth integer: " << timeMultithreadingNthInteger.count() << endl;
}