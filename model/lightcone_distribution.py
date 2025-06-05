import matplotlib.pyplot as plt

def chance_five_stars_lightcone(n: int) -> float:
    soft_stack = max(0, n - 64)
    return 0.00800 + soft_stack * 0.07

def get_lightcone_distribution() -> list[float]:
    store = 1
    vals = []

    for i in range(81): 
        if i != 0:
            store *= 1 - chance_five_stars_lightcone(i - 1)
        val = store * chance_five_stars_lightcone(i)
        vals.append(val)

    return vals

def plot_graph():
    plt.figure(figsize=(10, 6))
    plt.plot(range(81), get_lightcone_distribution(), marker='o', linestyle='-', color='blue')
    plt.title('Probability of Getting a 5-Star Lightcone at Each Warp (0-80)')
    plt.xlabel('Warp Number (Pull Index)')
    plt.ylabel('Probability')
    plt.grid(True)
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    plot_graph()
