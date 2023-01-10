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
    bool isPrime = true;
    for (int j = 2; j < number/2; ++j) {
        if (number % j == 0){
            isPrime = false;
            break;
        }
    }
    return isPrime;
}

// Method for finding primes in a given range.
void findPrimesInRangeWithThreads(int lowestNumber, int highestNumber, list<int> &primes){
    for (int i = lowestNumber; i < highestNumber; i++) {
        if (isPrime(i)) {
            primes.emplace_back(i);
        }
    }
}

// Method for dividing a range into a given amount of subsets that are as equal as possible.
vector<pair<int, int>> divideRangeIntoSubRanges(const int low, const int high, const int numberOfThreads) {

    vector<pair<int, int>> rangePairs{};
    const int delta = high+1 - low;
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
void findPrimesWithMultipleThreads(int lowestNumber, int highestNumber, int numberOfThreads, list<int>
&primesFoundWithMultithreading){
    vector<pair<int, int>> rangePairs = divideRangeIntoSubRanges(lowestNumber, highestNumber, numberOfThreads);
    vector<thread> threads;
    threads.reserve(numberOfThreads);

    for (int i = 0; i < numberOfThreads; i++){
        threads.emplace_back([i, rangePairs, &primesFoundWithMultithreading] {
            findPrimesInRangeWithThreads(rangePairs[i].first, rangePairs[i].second,
                                         primesFoundWithMultithreading);
        });
    }

    for (auto &thread : threads){
        thread.join();
    }
}

int main() {
    const int lowestNumber = 10;
    const int highestNumber = 10000;
    const int numberOfThreads = 2;
    list<int> primesFoundWithMultithreading;
    list<int> primesFoundWithSingleThreading;

    //Starts timer and finds primes, then sorts and finally stops timer.
    high_resolution_clock::time_point startMultipleThreads = high_resolution_clock::now();
    findPrimesWithMultipleThreads(lowestNumber, highestNumber, numberOfThreads, primesFoundWithMultithreading);
    primesFoundWithMultithreading.sort();
    high_resolution_clock::time_point stopMultipleThreads = high_resolution_clock::now();


    //Starts timer and finds primes, doesn't need to sort since it find primes sequentially, then finally stops timer.
    high_resolution_clock::time_point startSingleThread = high_resolution_clock::now();
    findPrimesInRangeWithThreads(lowestNumber, highestNumber, primesFoundWithSingleThreading);
    high_resolution_clock::time_point stopSingleThread = high_resolution_clock::now();


    //Checks if list are not equal, something must then have gone wrong.
    if (!std::equal(primesFoundWithSingleThreading.begin(), primesFoundWithSingleThreading.end(),
                    primesFoundWithMultithreading.begin(),primesFoundWithMultithreading.end())){
        cout << "List are not equal" << endl;
    }

    //Prints out the sorted primes from the multithreaded search.
    for (auto prime : primesFoundWithMultithreading){
        cout << prime << endl;
    }

    //Prints out the time it took for the different methods of prime searching.
    duration<double> timeMultiThreading = duration_cast<duration<double>>(stopMultipleThreads-startMultipleThreads);
    duration<double> timeSingleThreading = duration_cast<duration<double>>(stopSingleThread-startSingleThread);
    cout << "Time for multithreading: " << timeMultiThreading.count() << endl;
    cout << "Time for single threading: " << timeSingleThreading.count() << endl;
}