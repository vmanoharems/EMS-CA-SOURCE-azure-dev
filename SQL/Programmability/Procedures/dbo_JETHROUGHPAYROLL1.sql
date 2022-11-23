SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[JETHROUGHPAYROLL1]  -- exec JETHROUGHPAYROLL1 1,1,3,34
(
@PayrollFileID int,
@UserID int,
@ProdId int,
@VendorID int
)
AS

BEGIN

	SET NOCOUNT ON;

	declare @TransNo int;
	declare @DebitAmt decimal(18,2);
	declare @DebitLines int;
	declare @CreditLines int;
	declare @LaborClearing int;
	declare @FringeClearing int;
    declare @LaborClearingAmt decimal(18,2);
	declare @FringeClearingAmt decimal(18,2);
	declare @BatchNumber varchar(100);
	declare @JournalEntryID int;
	declare @InvoiceNumber varchar(100);
	declare @companyID int;
	declare @InvoiceID int;
	Declare @JEJeaderDescription varchar(50);
	
	update PayrollFile set VendorID=@VendorID where PayrollFileID=@PayrollFileID;

	select @TransNo=isnull(max(cast(TransactionNumber as int)),0) from JournalEntry;

	select @InvoiceNumber=InvoiceNumber,@companyID=CompanyID from PayrollFile where PayrollFileID=@PayrollFileID
	
	select @DebitAmt=sum(cast(PaymentAmount as decimal(18,2))) from PayrollExpensePost where PayrollFileID=@PayrollFileID 

	select @DebitLines=count(*) from PayrollExpensePost where PayrollFileID=@PayrollFileID

	 select @LaborClearing= isnull(count(*),0),@LaborClearingAmt= isnull(sum(cast(a.PaymentAmount as float)),0)
     from PayrollExpensePost as a inner join TblAccounts as b on a.AccountNumber=b.AccountCode 
     where a.PayrollFileID=@PayrollFileID 
	 and a.ExpenseType = 'L' --and a.AccountNumber not like '%99' 
	 and b.SegmentType='Detail'

     select @FringeClearing=isnull(count(*),0),@FringeClearingAmt= isnull(sum(cast(a.PaymentAmount as float)),0)
	 from PayrollExpensePost as a
     inner join TblAccounts as b on a.AccountNumber=b.AccountCode 
     where a.PayrollFileID=@PayrollFileID
     and a.ExpenseType = 'F' --and a.AccountNumber like '%99' 
	 and b.SegmentType='Detail'

	 declare @PayrollFilePeriod varchar(10);
	 select @PayrollFilePeriod = PeriodStatus, @companyID=CompanyID from PayrollFile where PayrollFileID=@PayrollFileID

	 Declare @ClosePID int;
	 set @ClosePID=dbo.GetCurrentOpenPeriodID(@companyID,default);
	 if @PayrollFilePeriod = 'Future'
	 begin
		set @ClosePID = @ClosePID + 1
	 end

	SELECT @BatchNumber=BatchNumber FROM PayrollFile  where ProdId=@ProdId and PayrollFileID=@PayrollFileID
	set @JEJeaderDescription=(select  'Payroll For '+Projectcode+' - '+CONVERT(char(10), Enddate,126)  from Payrollfile  where payrollfileid=@PayrollFileID);

	 insert into JournalEntry (TransactionNumber,Source,Description,EntryDate,DebitTotal,CreditTotal,TotalLines,ImbalanceAmount,AuditStatus,PostedDate
	 ,ReferenceNumber,BatchNumber,ProdId,CreatedDate,createdBy,CompanyId,SourceTable,ClosePeriod,DocumentNo,CurrentStatus) values
 	 (@TransNo+1,'PR',@JEJeaderDescription,CURRENT_TIMESTAMP,@DebitAmt,@DebitAmt,@DebitLines+@LaborClearing+@FringeClearing,0,'Posted',CURRENT_TIMESTAMP,@PayrollFileID,
	  @BatchNumber,@ProdId,CURRENT_TIMESTAMP,@UserID,@companyID,'Payroll',@ClosePID,@InvoiceNumber,'Current');
	 
	set @JournalEntryID=@@IDENTITY;

	declare @CCCode varchar(100);

	select @CCCode=CompanyCode from Company where CompanyID=@companyID;

	insert into JournalEntryDetail (JournalEntryId,TransactionLineNumber,COAId,DebitAmount,CreditAmount,VendorId,VendorName,ThirdParty,Note,
		CompanyId,ProdId,CreatedDate,CreatedBy,COAString,TransactionCodeString,SetId,SeriesId)
		select @JournalEntryID,@TransNo+1,b.COAID,a.PaymentAmount,0,@VendorID,'',0,CONVERT(char(10),PF.Enddate,126)+' | '+PU.LastName+', '+PU.FirstName+' | '+a.Paydescription,@companyID,@ProdId,CURRENT_TIMESTAMP,@UserID,
		b.COACODE
		,[dbo].[convertcodesJE](a.TransactionStr1),	a.SetID,a.SeriesID
		 from PayrollExpensePost as a
		 Join PayrollUser PU on a.PayrollUserid=PU.PayrollUserid 
		 Join PayrollFile PF on a.PayrollFileid=PF.PayrollFileid
		 LEFT JOIN TblAccounts as c on a.AccountNumber=c.AccountCode
		 left join COA as b on b.AccountId=c.AccountId and a.SegmentStr1=b.ParentCode
		 where PF.PayrollfileID=@PayrollFileID
			and b.ProdId=@ProdId;

	-----------------------------Clearing Account-----------------------------------------------------------------------
	 declare @LaborClearingAccountCnt int;
	 declare @FringeClearingAccountCnt int;
	 declare @COAIDLabor int;
	 declare @COAIDFringe int;

	declare @FringrClearingType varchar(100);
	declare @LaborClearingType varchar(100);

	declare @FringeCOAID int;
	declare @FringeCOAStr varchar(100);

	declare @LaborCOAID int;
	declare @LaborCOAStr varchar(100);

	if(@FringeClearing>0)
	begin

	     select @FringrClearingType=ClearingType  from AccountClearing where Type='Payroll' and AccountName='Fringe'
		  and CompanyId=@companyID and ProdId=@ProdId;

            if(@FringrClearingType='COA')
			begin

		     	 select @FringeCOAID=COAId  from AccountClearing where Type='Payroll' and AccountName='Fringe'
		         and CompanyId=@companyID and ProdId=@ProdId;
				 select @FringeCOAStr=COACODE  from COA  where COAID=@FringeCOAID;

				 insert into JournalEntryDetail (JournalEntryId,TransactionLineNumber,COAId,DebitAmount,CreditAmount,VendorId,VendorName,ThirdParty,Note
					,CompanyId,ProdId,CreatedDate,CreatedBy,COAString
				)values( @JournalEntryID,@TransNo+1,@FringeCOAID,0,@FringeClearingAmt,0,'',0,'Fringe'
				,@companyID,@ProdId,CURRENT_TIMESTAMP,@UserID,@FringeCOAStr)
	
			end
			else 
			begin

	 Declare @Acid int,@ParentCode varchar(100),@total decimal(18,2),@FringeCOA int,@FringeCOACODe varchar(100)

	 Declare FringeCursor CURSOR for
	 select 0 as Accountid,a.SegmentStr1 as SegmentStr1,isnull(sum(cast(a.PaymentAmount as float)),0) as total 
--	 select b.Accountid,a.SegmentStr1,isnull(sum(cast(a.PaymentAmount as float)),0) as total
	 from PayrollExpensepost   a
	 Join tblaccounts b on a.AccountNumber=b.Accountcode and b.SegmentType='Detail'
	  where a.PayrollFileid=@PayrollFileID 
	  and a.ExpenseType = 'F' --a.AccountNumber like '%99'  
		group by a.SegmentStr1
--	  group by a.AccountNumber,b.Accountid,a.SegmentStr1

	  Open FringeCursor;

fetch next from FringeCursor into @Acid ,@ParentCode ,@total

while @@FETCH_STATUS = 0
begin

 
 select @FringeCOAID=COAId  from AccountClearing where Type='Payroll' and AccountName='Fringe'
		         and CompanyId=@companyID and ProdId=@ProdId;

select  @FringeCOA=COAID,@FringeCOACODe=COACODE  from COA  where Parentcode=@ParentCode and AccountID=@FringeCOAID;

				 insert into JournalEntryDetail (JournalEntryId,TransactionLineNumber,COAId,DebitAmount,CreditAmount,CompanyId,ProdId,
				 CreatedDate,CreatedBy,COAString,Note)		
	           Values( @JournalEntryID,@TransNo+1,@FringeCOA,0,@total,@companyID,@ProdId,CURRENT_TIMESTAMP,@UserID,@FringeCOACODe,'Fringe');
	           
fetch next from FringeCursor into @Acid ,@ParentCode ,@total
end
close FringeCursor;
deallocate FringeCursor;
			end
	end

	if(@LaborClearing>0)
	begin

	     select @LaborClearingType=ClearingType  from AccountClearing where Type='Payroll' and AccountName='Labor'
		  and CompanyId=@companyID and ProdId=@ProdId;

            if(@LaborClearingType='COA')
			begin

		     	 select @LaborCOAID=COAId  from AccountClearing where Type='Payroll' and AccountName='Labor'
		         and CompanyId=@companyID and ProdId=@ProdId;

				 select  @LaborCOAStr=COACODE from Coa where COAID=@LaborCOAID

				 insert into JournalEntryDetail (JournalEntryId,TransactionLineNumber,COAId,DebitAmount,CreditAmount,VendorId,VendorName
				 ,ThirdParty,Note,CompanyId,ProdId,CreatedDate,CreatedBy,COAString)
				 values(@JournalEntryID,@TransNo+1,@LaborCOAID,0,@LaborClearingAmt,0,'',0,'Labor',@companyID,@ProdId,CURRENT_TIMESTAMP,@UserID,
	                    @LaborCOAStr)
			end
			else 
			begin
		
	 
	 Declare @AcidLabor int,@ParentCodeLabor varchar(100),@totalLabor decimal(18,2),@FringeCOALabor int,@FringeCOACODeLabor varchar(100)

	 Declare LaborCursor CURSOR for

	 select 0 as Accountid,a.SegmentStr1 as SegmentStr1,isnull(sum(cast(a.PaymentAmount as float)),0) as total 
--	 select b.Accountid,a.SegmentStr1,isnull(sum(cast(a.PaymentAmount as float)),0) as total
	 from PayrollExpensepost   a
	 Join tblaccounts b on a.AccountNumber=b.Accountcode and b.SegmentType='Detail'
	  where 
	  a.PayrollFileid=@PayrollFileID
	  and a.ExpenseType = 'L' --a.AccountNumber not  like '%99' and 
		group by a.SegmentStr1


	  Open LaborCursor;

     fetch next from LaborCursor into @AcidLabor ,@ParentCodeLabor ,@totalLabor

while @@FETCH_STATUS = 0
begin


     	 select @LaborCOAID=COAId  from AccountClearing where Type='Payroll' and AccountName='Labor'
		         and CompanyId=@companyID and ProdId=@ProdId;

select  @FringeCOALabor=COAID,@FringeCOACODeLabor=COACODE from COA  where Parentcode=@ParentCodeLabor and AccountID=@LaborCOAID;


				 insert into JournalEntryDetail (JournalEntryId,TransactionLineNumber,COAId,DebitAmount,CreditAmount,CompanyId,ProdId,
				    CreatedDate,CreatedBy,COAString,Note)		
	               Values( @JournalEntryID,@TransNo+1,@FringeCOALabor,0,@totalLabor,@companyID,@ProdId,CURRENT_TIMESTAMP,@UserID,@FringeCOACODeLabor,'Labor')
	           

    fetch next from LaborCursor into @AcidLabor ,@ParentCodeLabor ,@totalLabor
end
close LaborCursor;
deallocate LaborCursor;

			end
	end

	-------------------------we need to insert 2 credit line after clearation from Jared------------------------------
	declare @TCnt int;

	select @TCnt=isnull(count(*),0) from JournalEntryDetail where JournalEntryId=@JournalEntryID;
	update JournalEntry set TotalLines=@TCnt where JournalEntryId=@JournalEntryID


	select @JournalEntryID as JEID,@TransNo+1 as Result1,2 as Result2

END
GO