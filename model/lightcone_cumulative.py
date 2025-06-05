import matplotlib.pyplot as plt

from lightcone_distribution import get_lightcone_distribution

def get_lightcone_cumulative() -> list[float]:
    lightcone_distribution = get_lightcone_distribution()
    cumulative = []
    total = 0.0

    for value in lightcone_distribution[:81]:
        total += value
        cumulative.append(total)

    return cumulative

def plot_graph():
  plt.figure(figsize=(10, 6))
  plt.plot(range(81), get_lightcone_cumulative(), marker='o', linestyle='-', color='blue')
  plt.title('Cumulative Probability of Getting a 5-Star Lightcone at Each Warp (0-80)')
  plt.xlabel('Warp Number (Pull Index)')
  plt.ylabel('Cumulative Probability')
  plt.grid(True)
  plt.tight_layout()
  plt.show()

if __name__ == "__main__":
    plot_graph()
    