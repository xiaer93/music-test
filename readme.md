1/sinon��һ�����Ը�������
- https://www.w3cschool.cn/doc_sinon_2/
- spy�����Ӻ����������Ӷ�������ִ����
- stub������spyȫ�����ܣ�ͬʱ������Ϊ����
- mock�����Ӷ��󣨶�������������ص�mock���󲢲�������ִ��~�����û�д�����������ʹ��stub��


sandbox
�򻯵�ʹ�ù��̣���������

mock
- expectation.atLeast(number);
- expectation.atMost(number);
- expectation.never();
- expectation.once();
- expectation.twice();
- expectation.thrice();
- expectation.exactly(number);
- expectation.withArgs(arg1, arg2, ...);
- expectation.withExactArgs(arg1, arg2, ...);
- expectation.on(obj);
- expectation.verify();

spy
- spy.callCount
- spy.called
- spy.notCalled
- spy.calledOnce
- spy.calledTwice
- spy.calledThrice
- spy.firstCall
- spy.secondCall
- spy.thirdCall
- spy.lastCall
- spy.calledBefore(anotherSpy);
- spy.calledAfter(anotherSpy);
- spy.calledOn(obj);
- spy.alwaysCalledOn(obj);
- spy.calledWith(arg1, arg2, ...);
- spy.alwaysCalledWith(arg1, arg2, ...);
- spy.calledWithExactly(arg1, arg2, ...);
- spy.alwaysCalledWithExactly(arg1, arg2, ...);
- spy.calledWithMatch(arg1, arg2, ...);
- spy.alwaysCalledWithMatch(arg1, arg2, ...);
- spy.calledWithNew();
- spy.neverCalledWith(arg1, arg2, ...);
- spy.neverCalledWithMatch(arg1, arg2, ...);
- spy.threw();
- spy.threw("TypeError");
- spy.threw(obj);
- spy.alwaysThrew();
- spy.alwaysThrew("TypeError");
- spy.alwaysThrew(obj);
- spy.returned(obj);
- spy.alwaysReturned(obj);
- spy.thisValues
- spy.args
- spy.returnValues

stub
- stub.withArgs(arg1[, arg2, ...]);
- stub.onCall(n); ���� stub.onFirstCall();
- stub.reset();
- stub.callsFake(fakeFunction);
- stub.returns(obj);
- stub.returnsArg(index);
- stub.returnsThis();
- stub.resolves(value);
- stub.throws();
- stub.throws("TypeError");
- stub.throws(obj);
- stub.rejects();
- stub.callsArg(index);
- stub.callThrough();