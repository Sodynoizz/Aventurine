import matplotlib.pyplot as plt

from character_distribution import get_character_distribution

def get_character_cumulative() -> list[float]:
    character_distribution = get_character_distribution()
    cumulative = []
    total = 0.0

    for value in character_distribution[:91]:
        total += value
        cumulative.append(total)

    return cumulative

def plot_graph():
    plt.figure(figsize=(10, 6))
    plt.plot(range(91), get_character_cumulative(), marker='o', linestyle='-', color='blue')
    plt.title('Cumulative Probability of Getting a 5-Star Character at Each Warp (0-90)')
    plt.xlabel('Warp Number (Pull Index)')
    plt.ylabel('Cumulative Probability')
    plt.grid(True)
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    plot_graph()