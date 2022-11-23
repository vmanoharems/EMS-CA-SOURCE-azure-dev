CREATE PROCEDURE [dbo].[GetCheckNumberForPayment] -- GetCheckNumberForPayment 1, 60
	-- Add the parameters for the stored procedure here
	@BankId int,
	@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @CheckNo int

	if exists(select * from Payment where BankId=@BankId and ProdId=@ProdId and PayBy in ('Check','Manual Check'))
	begin
		print 'Found a Previous Payment';

		set @CheckNo = (
		select max(cast(P.CheckNumber as int))+ 1 as NextCheckNumber
			from Payment P
			join (
				select max(P.PaymentID) as PaymentID 
				from Payment P
				join CheckSetting CS
					on P.BankID = CS.BankID
				where P.PayBy in ('Check','Manual Check') 
				and try_cast(P.CheckNumber as int) is not null
				and try_cast(P.CheckNumber as int) between CS.StartNumber and CS.EndNumber
				and P.Status <> 'VOIDED'
				and P.BankID = @BankID and P.ProdID = @ProdID
			) as MP
				on P.PaymentID = MP.PaymentID
			where P.BankID = @BankID and P.ProdID = @ProdID and P.PayBy in ('Check','Manual Check')
			group by P.BankID,P.prodid
--			(select max(CONVERT(INT, CheckNumber)+1) from Payment where try_parse(CheckNumber as int) is not null AND BankId=@BankId and ProdId=@ProdId and PayBy='Check')
		)
	end
	else
	begin
		print 'Found no Previous Payment';
		if exists(select * from CheckSetting where BankId=@BankId and ProdId=@ProdId)
		begin
			print 'Found the Check Setting';
			set @CheckNo=( select  CONVERT(INT, StartNumber) from CheckSetting where BankId=@BankId and ProdId=@ProdId)
		end
		else
		begin
			print 'Found no Check Setting';
			set @CheckNo=1;
		end
	end

	select @CheckNo
END
GO