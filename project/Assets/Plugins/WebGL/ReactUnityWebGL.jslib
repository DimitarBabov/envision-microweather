mergeInto(LibraryManager.library, {
  GameOver: function (time, score) {
    dispatchReactUnityEvent("GameOver", time, score);
  },
PairWallet: function () {
    dispatchReactUnityEvent("PairWallet");
  }
});
