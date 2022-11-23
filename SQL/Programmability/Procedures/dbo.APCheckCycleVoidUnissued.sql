SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[APCheckCycleVoidUnissued]
 @BankID int,
 @startvoid int ,
 @endvoid int,
 @UserID int,
 @BatchNumber varchar(50),
 @ProdID int
AS

BEGIN
declare @ERRORMSG varchar(50) = '';
declare @isinvalidvoid bit = 0;

	if @UserID = -1
		begin
			select 'VOID UNISSUED' as Action
				, PaymentId
				, GroupNumber
				, VendorId
				, PaidAmount
				, CheckDate
				, CheckNumber
				, BankId
				, Status
				, PayBy
				, PaymentDate
				, Memo
				, BatchNumber
				, ProdId
				, CreatedBy
				, CreatedDate
				, ModifyBy
				, ModifyDate
				, isdeleted
			from Payment P
			where P.Status = 'Void Unissued'
			and BankID = @BankID
		end

	if @endvoid < @startvoid
		begin
			set @ERRORmsg = 'Invalid Ending';
			set @isinvalidvoid = 1;
		end
	else if exists (select * from CheckSetting where (StartNumber > @startvoid or EndNumber < @endvoid) and BankID = @BankID)
		begin
			set @ERRORmsg = 'Invalid Range';
			set @isinvalidvoid = 1;
		end
	else if exists (
				select * from Payment 
				where PayBy = 'Check' 
				and CheckNumber between @startvoid and @endvoid
				and BankID = @BankID
			) 
		begin
			select 'Existing Check Present' as Action,-1 AS PaymentId,'' as GroupNumber,-1 as VendorId,0.00 as PaidAmount, getdate() CheckDate, '' CheckNumber,-1 BankId,'' as Status,'' as PayBy,getdate() as PaymentDate
				,'' as Memo,'' as BatchNumber,@ProdId as ProdId,@UserID as CreatedBy,getdate() as CreatedDate,null ModifyBy,null ModifyDate,CAST(0 AS BIT) AS isdeleted
			from Payment P 
			where P.PayBy = 'Check' 
			and P.CheckNumber between @startvoid and @endvoid
			and P.BankID = @BankID;
			return; 
		end

	else if exists(select CheckRunID from CheckRun where ProdID=@ProdID and BankID=@BankID and Status='WORKING')
		begin
			set @ERRORmsg = 'CheckRun in Progress';
			set @isinvalidvoid = 1;
		end

	if @isinvalidvoid = 1
		begin
			select A.Action,-1 AS PaymentId,'' as GroupNumber,-1 as VendorId,0.00 as PaidAmount, getdate() CheckDate, '' CheckNumber,-1 BankId,'' as Status,'' as PayBy,getdate() as PaymentDate
				,'' as Memo,'' as BatchNumber,@ProdId as ProdId,@UserID as CreatedBy,getdate() as CreatedDate,null ModifyBy,null ModifyDate,CAST(0 AS BIT) AS isdeleted
			from Payment P
			right outer join (select @ERRORmsg as Action) A
			on P.Status= A.Action
			return;	
		end

begin try

	begin transaction
	declare @CheckRunID int;

	declare @voidedpayments VoidPayments_UDT;


	exec @CheckRunID = dbo.[GetCheckRun_withReturnONLY] @ProdID ,@BankID ,@UserID 
	print @CheckRunID
		
	;WITH n(n,voidit) AS
	(
		SELECT 1,@startvoid
		UNION ALL
		SELECT n+1,@startvoid+n FROM n WHERE n <= (@endvoid - @startvoid)
	)
	insert Payment (GroupNumber,VendorID,PaidAmount,CheckDate,CheckNumber,BankID,Status,PayBy,PaymentDate,Memo,BatchNumber,ProdID,CreatedBy,CreatedDate,ModifyBy,ModifyDate,isdeleted)
	output 'Inserted' as Action,inserted.* into @voidedpayments
	SELECT 0,null,0.00,getdate(),voidit as CheckNumber,@BankID,'Void Unissued','Check',getdate(),'Void Unissued Check',@BatchNumber,@ProdID,@UserID,getdate(),null,null,0
		FROM n ORDER BY n
		OPTION (MAXRECURSION 1000)
	insert into CheckRunAddon (CheckRunID, PaymentID, CheckNo,Status)
		select @CheckRunID, V.PaymentID, V.CheckNumber,'COMPLETED'
			from @voidedPayments V;
		
	exec dbo.[ComplateCheckRun] @CheckRunID, @ProdID;
	if @@error=0
	begin
		commit transaction;
		select * from @voidedpayments;
	end
	else
	begin
		rollback transaction;
	end
end try
begin catch 
	rollback transaction;
end catch
END
GO